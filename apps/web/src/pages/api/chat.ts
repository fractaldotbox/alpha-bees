import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }): Promise<Response> => {
  try {
    const { message } = await request.json<{ message: string }>();
    // Generate a simple response based on the submitted message.
    const responseMessage = `You said: "${message}" – here's some input from the API!`;

    return new Response(JSON.stringify({ response: responseMessage }), {
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
