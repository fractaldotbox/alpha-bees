import type { APIRoute } from "astro";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "astro/zod";
import { tool } from "@langchain/core/tools";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const modifier = `
  You are a helpful agent that can provide trading signals, draw charts, and provide insights on yield charts.

  If someone asks you to do something you can't do with your currently available tools, you must say so.

  You can use the following tools to help you make analysis and draw charts, for the second tool to work, you need to run the first tool first to obtain the ID:
  - fetchPoolListFromDefiLlama
  - fetchPoolChartFromId


  If someone requests you to draw a chart, you just need to use the fetchPoolTimeSeriesFromId tool to get the time series data. Get the relevant ones that the user needs, the arguments can be obtained through the fetchPoolListFromDefiLlama tool.
  Please supply the correct poolIds for the chart. You can pass in multiple poolIds if you want to draw multiple charts.
  If do have to draw a chart, do indicate the user to look at the "Market Chart" section on the screen.



  Be concise and helpful with your responses.
  Refrain from restating your tools' descriptions unless it is explicitly requested.
`;

type Response = {
  text: string;
  graph: {
    graphType: "yieldHistoricalGraph";
    poolIds: string[];
  } | null;
};

// d

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.1,
  openAIApiKey: process.env.OPENAI_API_KEY,
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

const responseFormatterTool = tool(async () => {}, {
  name: "responseFormatter",
  description: "Format the LLM response into a JSON object",
  schema: responseSchema,
});

const toolsByName = {
  fetchPoolListFromDefiLlama,
  fetchPoolTimeSeriesFromId,
  responseFormatterTool,
};

export const POST: APIRoute = async ({ request }): Promise<Response> => {
  try {
    const { message } = await request.json<{ message: string }>();

    console.log("generating response");

    const llmWithTools = llm.bindTools([
      fetchPoolListFromDefiLlama,
      fetchPoolTimeSeriesFromId,
    ]);

    const messages = [
      new SystemMessage({ content: modifier }),
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
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
