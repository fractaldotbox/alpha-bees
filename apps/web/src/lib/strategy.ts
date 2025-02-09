import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: import.meta.env.OPENAI_API_KEY,
});

type ResponseFormat = {
    text: string;
};



export const createStartegy = async (prompt: string) => {
    const response = await openai.chat.completions.create({
        model: "o1-mini",
        messages: [
            // { role: "developer", content: "You are a helpful assistant." },
            {
                role: "user",
                content: "Given this is the requirement:" + prompt + "formualate a strategy advice in this format" +
                    "prompt for another agent to execute on aave, each with priority number. 10 means highest",
            },
        ],
    });

    return response;
}


// const Policy = z.object({
//     name: z.string(),
//     policy: z.string(),
//     priority: z.number()
// });
