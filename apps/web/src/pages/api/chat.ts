import { storeToNillionVault } from "@/lib/nillion";
import { createStrategy } from "@/lib/strategy";
import type { Message } from "@/store/messages";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import type { APIRoute } from "astro";
import { z } from "astro/zod";

const modifier = `
  You are a helpful agent that can provide trading signals, draw charts, and provide insights on yield charts.

  If someone asks you to do something you can't do with your currently available tools, you must say so.

  You can use the following tools to help you make analysis and draw charts, for the second tool to work, you need to run the first tool first to obtain the ID:
  - fetchPoolListFromDefiLlama
  - fetchPoolChartFromId
  - fetchStrategyAdvice
  - commitStrategy

  If someone asks you to GENERATE OR ADVISE a strategy, you need to use the fetchStrategyAdvice tool.  You must pass in the user prompt directly to the tool. Render the response from there instead of your own responses. You need to ask to the user whether they want to commit the strategy or not
  
  If the user wants to commit the strategy, you need to use the commitStrategy tool to commit the strategy to the strategy vault. This would mean that the worker agents will start acting upon them.

  If someone requests you to draw a chart, you just need to use the fetchPoolTimeSeriesFromId tool to get the time series data. Get the relevant ones that the user needs, the arguments can be obtained through the fetchPoolListFromDefiLlama tool.
  Draw charts when applicable, even if the user does not ask for it.
  Please supply the correct poolIds for the chart. You can pass in multiple poolIds if you want to draw multiple charts.
  If do have to draw a chart, do indicate the user to look at the "Market Chart" section on the screen.

  Remember the user's previous messages and use them to generate the response.

  Be concise but clear and helpful with your responses.
  Refrain from restating your tools' descriptions unless it is explicitly requested.
`;

type ChatResponse = {
  text: string;
  graph: {
    graphType: "yieldHistoricalGraph";
    poolIds: string[];
  } | null;
};

// https://github.com/langchain-ai/langchain/issues/28895
const llm = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0.1,
  openAIApiKey: import.meta.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY,
});

const fetchPoolListFromDefiLlama = tool(
  async () => {
    const response = await fetch("https://yields.llama.fi/pools");
    const json = await response.json();

    // for now, only return the first 200 pools
    return json.data.slice(0, 200);
  },
  {
    name: "fetchPoolListFromDefiLlama",
    description: "Fetch pool list from DefiLlama",
  },
);

const fetchStrategyAdvice = tool(
  async ({ prompt }: { prompt: string }) => {
    try {
      const response = await createStrategy(prompt);
      return response;
    } catch (e) {
      console.error("Failed to generate strategy:", e);
      return [];
    }
  },
  {
    name: "fetchStrategyAdvice",
    description:
      "Generate a trading strategy advice that you can use to generate policy",
    schema: z.object({
      prompt: z
        .string()
        .describe("The prompt form the user to generate strategy advice"),
    }) as any,
  },
);

const commitStrategy = tool(
  async (strategy: any) => {
    storeToNillionVault("strategy", JSON.stringify(strategy));
  },
  {
    name: "commitStrategy",
    description: "Commit the strategy to the strategy vault",
  },
);

const fetchPoolTimeSeriesFromId = tool(
  async (poolId: string) => {
    const response = await fetch(`https://yields.llama.fi/chart/${poolId}`);
    const json = await response.json();
    return json.data;
  },
  {
    name: "fetchPoolTimeSeriesFromId",
    description:
      "Fetch pool time series using ID, ID can be obtained from the fetchPoolListFromDefiLlama tool",
    schema: z.object({
      poolId: z.string().describe("The pool id to fetch the time series for"),
    }) as any,
  },
);

const responseSchema = z.object({
  text: z.string(),
  graph: z
    .object({
      graphType: z.enum(["yieldHistoricalGraph"]),
      poolIds: z.array(z.string()),
    })
    .nullable(),
});

const responseFormatterTool = tool(async () => { }, {
  name: "responseFormatter",
  description: "Format the LLM response into a JSON object",
  schema: responseSchema,
});

const toolsByName = {
  fetchPoolListFromDefiLlama,
  fetchPoolTimeSeriesFromId,
  fetchStrategyAdvice,
  responseFormatterTool,
};

export const POST: APIRoute = async ({ request }): Promise<Response> => {
  try {
    const { message, prevMessages } = await request.json();

    console.log("generating response");

    const llmWithTools = llm.bindTools([
      fetchPoolListFromDefiLlama,
      fetchPoolTimeSeriesFromId,
      fetchStrategyAdvice,
    ]);

    const messages = [
      new SystemMessage({ content: modifier }),
      ...prevMessages.map((msg: Message) =>
        msg.sender === "user"
          ? new HumanMessage({ content: msg.text })
          : new AIMessage({ content: msg.text }),
      ),
      new HumanMessage({ content: message }),
    ];

    // First interaction to get tool calls
    const aiMessage = await llmWithTools.invoke(messages);

    // If there are tool calls, execute them and add their results to the conversation
    if (aiMessage.tool_calls?.length) {
      for (const toolCall of aiMessage.tool_calls) {
        const tool = toolsByName[toolCall.name as keyof typeof toolsByName];
        console.log(toolCall.name);
        if (tool) {
          const toolResult = await tool.invoke(toolCall);

          console.log("tool result", toolResult);
          // Add tool result as a message
          messages.push(
            new SystemMessage({
              content: JSON.stringify(toolResult),
              additional_kwargs: {
                tool_call_id: toolCall.id,
                name: toolCall.name,
              },
            }),
          );
        }
      }

      // Get final response after tool execution
      const finalResponse = await llm
        .withStructuredOutput(responseSchema)
        .invoke(messages);

      console.log(finalResponse);
      return new Response(JSON.stringify(finalResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // If no tool calls, return the initial response
    return new Response(JSON.stringify(aiMessage), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
