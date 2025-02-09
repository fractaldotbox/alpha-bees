import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: import.meta.env.OPENAI_API_KEY,
});

type StrategyPrompt = {
	text: string;
	priority: number;
};

export const createStrategy = async (
	prompt: string,
): Promise<StrategyPrompt[]> => {
	console.log("createStrategy", { prompt });

	const response = await openai.chat.completions.create({
		// TODO: use o1-mini or o3 when can access
		model: "gpt-4o-mini",
		response_format: { type: "json_object" },
		messages: [
			{
				role: "system",
				content: `You are an AI Strategy Coordinator specializing in AAVE operations.

				Your role is to:
				1. Convert user prompts into precise, actionable strategies.
				2. Create instructions for chain-specific sub-agents to execute.
				3. Ensure all numerical values and parameters are exact.

				Response format:
				- Return only an array of JSON objects wrapped in a "data" key, do not return anything else.
				- Each object must ONLY contain:
					- "text": Clear instruction text
					- "priority": number indicating the priority of the instruction

				Keep responses concise and focused on execution details.`,
			},
			{
				role: "user",
				content: prompt,
			},
		],
	});

	const content = response.choices[0]?.message?.content;
	if (!content) {
		throw new Error("No response from OpenAI");
	}

	try {
		const strategy = JSON.parse(content) as { data: StrategyPrompt[] };
		return strategy.data;
	} catch (e) {
		throw new Error("Failed to parse OpenAI response into strategy");
	}
};
