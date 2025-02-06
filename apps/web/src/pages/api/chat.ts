import type { APIRoute } from "astro";
import {
  AgentKit,
  twitterActionProvider,
  ViemWalletProvider,
} from "@coinbase/agentkit";
import { getLangChainTools } from "@coinbase/agentkit-langchain";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { http, createWalletClient } from "viem";
import { MemorySaver } from "node_modules/@langchain/langgraph/dist/web";
import { z } from "astro/zod";
import { tool } from "@langchain/core/tools";
import { HumanMessage } from "@langchain/core/messages";

const account = privateKeyToAccount(
  "0x4c0883a69102937d6231471b5dbb6208ffd70c02a813d7f2da1c54f2e3be9f38",
);

const client = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(),
});

const walletProvider = new ViemWalletProvider(client);

const modifier = `
  You are a helpful agent that can provide trading signals, draw charts, and provide insights on yield charts.
  You are empowered to draw charts and provide insights on yield charts.

  If someone asks you to do something you can't do with your currently available tools, you must say so.

  You can draw charts using the drawYieldHistoricalGraph action.

  Be concise and helpful with your responses.
  Refrain from restating your tools' descriptions unless it is explicitly requested.
`;

const ResponseSchema = z.object({
  paragraphs: z
    .array(
      z.object({
        text: z.string().describe("The text to be displayed"),
        actions: z
          .array(
            z.object({
              action: z
                .string()
                .describe(
                  "The action to be taken, pick exactly one, options are [drawYieldHistoricalGraph]",
                ),
              data: z.any().describe("The data to be passed to the action"),
            }),
          )
          .describe("The actions to be taken"),
      }),
    )
    .describe("The paragraphs to be displayed"),
});

const responseFormatterTool = tool(async () => {}, {
  name: "responseFormatter",
  schema: ResponseSchema,
});

async function initialize() {
  // Initialize LLM
  const llm = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0.1,
    maxTokens: 1000,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const agentkit = await AgentKit.from({
    cdpApiKeyName: process.env.CDP_API_KEY_NAME,
    cdpApiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(
      /\\n/g,
      "\n",
    ),
    actionProviders: [],
    walletProvider,
  });

  const tools = await getLangChainTools(agentkit);

  // Store buffered conversation history in memory
  const memory = new MemorySaver();

  // React Agent options
  const agentConfig = {
    configurable: { thread_id: "Chart Drawing Bee" },
  };

  // Create React Agent using the LLM and Twitter (X) tools
  const agent = createReactAgent({
    llm,
    tools: [...tools, responseFormatterTool],
    checkpointSaver: memory,
    messageModifier: modifier,
  });

  return { agent, config: agentConfig };
}

export const POST: APIRoute = async ({ request }): Promise<Response> => {
  try {
    const { message } = await request.json<{ message: string }>();

    const { agent, config } = await initialize();

    // Generate a simple response based on the submitted message.
    // const responseMessage = `You said: "${message}" – here's some input from the API!`;

    const responseMessage = await agent.invoke({
      messages: [new HumanMessage(message)],
    });

    return new Response(
      JSON.stringify({ response: responseMessage.structuredResponse }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
