import * as markets from "@bgd-labs/aave-address-book";
import {
	type ActionProvider,
	AgentKit,
	CdpWalletProvider,
	type EvmWalletProvider,
	WalletProvider,
	cdpApiActionProvider,
	cdpWalletActionProvider,
	customActionProvider,
	erc20ActionProvider,
	morphoActionProvider,
	pythActionProvider,
	walletActionProvider,
	wethActionProvider,
} from "@coinbase/agentkit";
import { getLangChainTools } from "@coinbase/agentkit-langchain";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import {
	aaveActionProvider,
	findAaveMarketAssets,
} from "./agentkit/action-providers/aave/aaveActionProvider";

import { expand, fromEvent, interval, of, race, repeat, take } from "rxjs";
import { getAllRecords } from "./nillion";
import {
	createAddressbookPrompt,
	createPolicyPrompt,
	createPortfolioPrompt,
} from "./prompt-util";
import SwarmPortfolioService from "./swarm-portfolio.service";
import "reflect-metadata";
import { z } from "zod";
import { SupplySchema } from "./agentkit/action-providers/aave/schemas";
import { Address } from "viem";
import type { Logger } from "pino";
const NILLION_POLICY_SCHEMA_ID = "9d03997d-2200-452d-87f9-92d4728ea93e";

// @ts-ignore
BigInt.prototype.toJSON = function () {
	return this.toString();
};

/**
 * Validates that required environment variables are set
 *
 * @throws {Error} - If required environment variables are missing
 * @returns {void}
 */
function validateEnvironment(): void {
	const missingVars: string[] = [];

	// Check required variables
	const requiredVars = [
		"OPENAI_API_KEY",
		"CDP_API_KEY_NAME",
		"CDP_API_KEY_PRIVATE_KEY",
	];
	requiredVars.forEach((varName) => {
		if (!process.env[varName]) {
			missingVars.push(varName);
		}
	});

	// Exit if any required variables are missing
	if (missingVars.length > 0) {
		console.error("Error: Required environment variables are not set");
		missingVars.forEach((varName) => {
			console.error(`${varName}=your_${varName.toLowerCase()}_here`);
		});
		process.exit(1);
	}

	// Warn about optional NETWORK_ID
	if (!process.env.NETWORK_ID) {
		console.warn(
			"Warning: NETWORK_ID not set, defaulting to base-sepolia testnet",
		);
	}
}

// Add this right after imports and before any other code
validateEnvironment();

/**
 * Initialize the agent with CDP Agentkit
 *
 * @returns Agent executor and config
 */
export async function initializeAgent() {
	try {
		const agentName = process.env.AGENT_NAME || "Worker Bee";
		console.log(`Initializing agent: ${agentName}`);
		console.log(`network id:`, process.env.NETWORK_ID);

		// Initialize LLM
		const llm = new ChatOpenAI({
			model: "gpt-4o-mini",
		});

		// we could use watchEvents to listen to aave contract events
		// or balances change
		// now we keep it simple to keep update portfolio

		// Configure CDP Wallet Provider
		const config = {
			apiKeyName: process.env.CDP_API_KEY_NAME,
			apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(
				/\\n/g,
				"\n",
			),
			cdpWalletData: process.env.CDP_WALLET_DATA || "{}",
			networkId: process.env.NETWORK_ID || "base-sepolia",
		};

		const MORPHO_ACTION_ON = process.env.MORPHO_ACTION_ON === "true" || false;
		const AAVE_ACTION_ON = process.env.AAVE_ACTION_ON === "true" || true;

		const aaveAction = aaveActionProvider();

		const walletProvider = await CdpWalletProvider.configureWithWallet(config);

		// workaround for decorator not working and results in incorrect args
		// recreate those actions

		const customAaveAction = customActionProvider<EvmWalletProvider>(
			aaveAction.getActions(walletProvider).map((action) => ({
				...action,
				invoke: async (walletProvider, args: any) => {
					// console.log("custom action provider", args, action.name);
					if (action.name === "AaveActionProvider_supply") {
						return await aaveAction.supply(walletProvider, args);
					} else if (action.name === "AaveActionProvider_withdraw") {
						return await aaveAction.withdraw(walletProvider, args);
					}
					// return await action.invoke(args);
				},
			})),
		);

		// @ts-ignore
		await aaveAction.approveAll(walletProvider);

		const actionProviders = [
			wethActionProvider(),
			pythActionProvider(),
			walletActionProvider(),
			erc20ActionProvider(),
			AAVE_ACTION_ON && customAaveAction,
			MORPHO_ACTION_ON && morphoActionProvider(),

			cdpApiActionProvider({
				apiKeyName: process.env.CDP_API_KEY_NAME,
				apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
			}),

			cdpWalletActionProvider({
				apiKeyName: process.env.CDP_API_KEY_NAME,
				apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
			}),
		].filter(Boolean) as ActionProvider[];

		// Initialize AgentKit
		const agentkit = await AgentKit.from({
			walletProvider,
			actionProviders,
		});

		const tools = await getLangChainTools(agentkit);

		// Store buffered conversation history in memory
		const memory = new MemorySaver();
		const agentConfig = { configurable: { thread_id: "Worker Bee" } };

		// Create React Agent using the LLM and CDP AgentKit tools
		const agent = createReactAgent({
			llm,
			tools,
			checkpointSaver: memory,
			messageModifier:
				`
        You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit. You are 
        empowered to interact onchain using your tools. Before executing your first action, get the wallet details to see what network 
        you're on. If there is a 5XX (internal) HTTP error code, ask the user to try again later. Be concise and helpful with your responses. 
        // ` + `Never use faucet and request_faucet_funds action.`
				+ "Never ask for any other further requests or actions"
				+ `Analyze the portoflio and explain your rationale for any action`
		});

		return { agent, config: agentConfig, walletProvider };
	} catch (error) {
		console.error("Failed to initialize agent:", error);
		throw error; // Re-throw to be handled by caller
	}
}

/**
 * Run the agent autonomously with specified intervals
 *
 * @param agent - The agent executor
 * @param config - Agent configuration
 * @param interval - Time interval between actions in seconds
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function runAutonomousMode(
	agent: any,
	config: any,
	walletProvider: EvmWalletProvider,
	logger: Logger
) {
	logger.info("Starting autonomous mode...");

	const nillionPolicies = await getAllRecords(NILLION_POLICY_SCHEMA_ID);

	logger.info("Retrieved Policy from the Queen:", nillionPolicies);
	logger.info("--------");

	const swarmAddresses = [
		...new Set([
			// sepolia ETH agent
			"0x4A9b1ECD1297493B4EfF34652710BD1cE52c6526",

			// base-sepolia Aave USDC agent
			"0x94D8C42AFE90C15b7Dd55902f25ed6253fD47F8c",

			// base-sepolia Morpho USDC agent
			"0x6B608C852850234d42e0C87db86C491A972E3E01",
		]),
	] as `0x${string}`[];

	// eslint-disable-next-line no-constant-condition
	const swarmPortfolioService = new SwarmPortfolioService(
		swarmAddresses,
		[markets.AaveV3BaseSepolia.ASSETS.USDC.UNDERLYING],
		config.networkId,
	);

	// Create an observable from an event (replace 'actionEvent' with the actual event name)
	const event$ = swarmPortfolioService.listenToTransactions([], [walletProvider.getAddress()] as Address[]);

	const interval$ = interval(60 * 1000);

	// Build a cycle that waits for either an event or the interval, then re-runs indefinitely.
	const cycle$ = of(null)
		.pipe(expand(() => race(event$, interval$).pipe(take(1))))
		.subscribe(async (value) => {
			console.log("agent cycle");
			try {
				const portfolio = await swarmPortfolioService.getPortfolio();

				console.log(portfolio);

				// const thought = 'fund yourself with usdc faucet 3 times, do not ask for confirmations';

				const thought =
					createPortfolioPrompt(config.networkId, portfolio) +
					"When you communicate token balance, append n to the amount if it is whole unit. i.e. 4n USDC" +
					"You can use the tools to gather data to make your decision" +
					"Aave refers to the v3 lending protocol" +
					"for erc20 token and actions like get_balance or supply, results is whole unit accounted for decimals. i.e. 4 means 0.000004USDC not 4USDC as USDC use 6 decimals" +
					"Supply is not a simple transfer. When you want to supply, Use Aave action to supply USDC onto Aave protocol, in testnet such as sepolia or base-sepolia. Use correct arguments" +
					"Do not ask for confirmation for supply" +
					"Do not use typical address on mainnet which will be different" +
					"Do not deploy any ERC20, NFT" +
					createAddressbookPrompt(config.networkId) +
					"Choose an action or set of actions and execute it that highlights your abilities." +
					createPolicyPrompt(nillionPolicies);

				const stream = await agent.stream(
					{ messages: [new HumanMessage(thought)] },
					config,
				);

				for await (const chunk of stream) {
					if ("agent" in chunk) {
						logger.info(chunk.agent.messages[0].content);
					} else if ("tools" in chunk) {
						logger.info(chunk.tools.messages[0].content);
					}
					logger.info("-------------------");
				}
			} catch (err) {
				console.error(err);
			}
		});
}
