import type { APIRoute } from "astro";
import {
  AgentKit,
  twitterActionProvider,
  ViemWalletProvider,
} from "@coinbase/agentkit";
import { getLangChainTools } from "@coinbase/agentkit-langchain";
import { ChatOpenAI, OpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { http, createWalletClient } from "viem";
import { MemorySaver } from "node_modules/@langchain/langgraph/dist/web";
import { z } from "astro/zod";
import { tool } from "@langchain/core/tools";
import { HumanMessage } from "@langchain/core/messages";
import dotenv from "dotenv";

dotenv.config();

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

  If someone asks you to do something you can't do with your currently available tools, you must say so.

  You can draw charts yield historical graphs, only if someone requests you to draw one. 
  If someone does not request you to draw yield historical graphs, then you do not have to draw the chart.

  Be concise and helpful with your responses.
  Refrain from restating your tools' descriptions unless it is explicitly requested.
`;

type Response = {
  text: string;
  graph: {
    graphType: "yieldHistoricalGraph";
    poolId: "aa70268e-4b52-42bf-a116-608b370f9501";
  } | null;
};

// d

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.1,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

export const POST: APIRoute = async ({ request }): Promise<Response> => {
  try {
    const { message } = await request.json<{ message: string }>();

    // const { agent, config } = await initialize();

    // Generate a simple response based on the submitted message.
    // const responseMessage = `You said: "${message}" – here's some input from the API!`;

    console.log("generating response");

    const responseMessage = await llm
      .withStructuredOutput({
        type: "object",
        properties: {
          text: { type: "string" },
          graph: {
            type: "object",
            properties: {
              graphType: {
                type: "string",
                enum: ["yieldHistoricalGraph"],
              },
              poolId: {
                type: "string",
                enum: ["aa70268e-4b52-42bf-a116-608b370f9501"],
              },
            },
            required: ["graphType", "poolId"],
          },
        },
        required: ["text"],
      })
      .invoke(message);

    console.log(responseMessage);

    return new Response(
      JSON.stringify({ response: responseMessage as Response }),
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
