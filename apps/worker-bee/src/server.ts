import { promises as fs } from "fs";
import path from "path";
// Import the framework and instantiate it
import Fastify from "fastify";
import { initializeAgent, runAutonomousMode } from "./chatbot";

import pino from "pino";
import pretty from 'pino-pretty'

const streams = [
	{ stream: pretty() },
	{ stream: pino.destination("worker.log") },
];

const fileLogger = pino({
}, pino.multistream(streams));
const PORT = process.env.PORT || "3000";

const fastify = Fastify({
	logger: true,
});

fastify.get("/chat", async function handler(request, reply) {
	try {
		const logPath = path.resolve(__dirname, "../worker.log");

		const logContent = await fs.readFile(logPath, "utf-8");
		return { log: logContent };
	} catch (error) {
		console.log(error);
		reply.status(500);
		return { error: "Could not read log file" };
	}
});

async function main() {
	try {
		const { agent, config, walletProvider } = await initializeAgent();
		// always run autonomous mode
		runAutonomousMode(agent, config, walletProvider, fileLogger);

		fileLogger.info("Starting Server with Agent...");
		await fastify.listen({ port: Number(PORT) });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
}

// Run the server!

if (require.main === module) {
	main().catch((error) => {
		console.error("Fatal error:", error);
		process.exit(1);
	});
}
