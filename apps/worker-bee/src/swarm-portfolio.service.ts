import { Observable, fromEvent } from "rxjs";
import { bufferTime, filter, map, tap } from "rxjs/operators";
import { webSocket } from "rxjs/webSocket";
import {
	http,
	type Address,
	Chain,
	type Hex,
	PublicClient,
	createPublicClient,
	createWalletClient,
} from "viem";

import {
	type ERC20ActionProvider,
	NETWORK_ID_TO_VIEM_CHAIN,
	ViemWalletProvider,
	erc20ActionProvider,
} from "@coinbase/agentkit";
import {
	Alchemy,
	type AlchemyMinedTransactionsAddress,
	AlchemySubscription,
	Network,
} from "alchemy-sdk";

import { baseSepolia, sepolia } from "viem/chains";
import { abi } from "./erc20-constants";

interface PriceUpdate {
	symbol: string;
	price: number;
}

class SwarmPortfolioService {
	private erc20ActionProvider: ERC20ActionProvider;
	private addresses = [] as Address[];
	private tokenAddress = [] as Address[];
	#publicClient;
	#alchemy: Alchemy;

	constructor(
		addresses: Address[],
		tokenAddresses: Address[],
		networkId: string,
	) {
		this.erc20ActionProvider = erc20ActionProvider();
		this.addresses = addresses;
		const chain = NETWORK_ID_TO_VIEM_CHAIN[networkId];

		this.#publicClient = createPublicClient({
			chain,
			transport: http(),
		});

		this.tokenAddress = tokenAddresses;

		const network =
			networkId === "sepolia" ? Network.ETH_SEPOLIA : Network.BASE_SEPOLIA;

		const settings = {
			apiKey: process.env.ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
			network,
		};

		this.#alchemy = new Alchemy(settings);
	}

	listenToTransactions = (
		listenAddresses?: AlchemyMinedTransactionsAddress[],
	) => {
		const emitter = new EventTarget();

		const event$ = fromEvent(emitter, "transaction");

		console.log("start listenToTransactions");
		this.#alchemy.ws.on(
			{
				method: AlchemySubscription.MINED_TRANSACTIONS,
				//@ts-ignore
				addresses: [
					...(this.addresses.map((address) => ({
						from: address.toString(),
					})) as AlchemyMinedTransactionsAddress[]),
					...(listenAddresses || []),
				],
				includeRemoved: true,
				hashesOnly: false,
			},
			(tx) => {
				console.log("transaction recived, let me check our portfolio");
				console.log(tx);

				emitter.dispatchEvent(new CustomEvent("transaction", { detail: tx }));
			},
		);

		return event$;
	};

	getPortfolio = async () => {
		// Get native and token balances for each address
		const nativeBalances = await this.getNativeBalances(this.addresses);
		const tokenBalances = await this.getBalances(
			this.addresses,
			this.tokenAddress[0],
		);

		const portfolio: { [address: string]: { ETH: bigint; USDC: bigint } } = {};
		for (const index of this.addresses.keys()) {
			const address = this.addresses[index];

			portfolio[address] = {
				ETH: nativeBalances[index],
				USDC: tokenBalances[index],
			};
		}

		return portfolio;
	};

	getNativeBalances = async (addresses: Address[]) => {
		const balances = await Promise.all(
			addresses.map(async (address) => {
				return this.#publicClient.getBalance({ address });
			}),
		);

		return balances;
	};

	getBalances = async (addresses: Address[], tokenAddress: Address) => {
		const balances = await Promise.all(
			addresses.map(async (address) => {
				return await this.#publicClient.readContract({
					address: tokenAddress as Hex,
					abi,
					functionName: "balanceOf",
					args: [address],
				});
			}),
		);

		return balances;
	};
}

export default SwarmPortfolioService;
