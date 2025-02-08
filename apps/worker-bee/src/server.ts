// Import the framework and instantiate it
import Fastify from 'fastify'
import { promises as fs } from 'fs'
import path from 'path'
import pino from 'pino'
import { initializeAgent, runAutonomousMode } from './chatbot'

const fileLogger = pino({
}, pino.destination('worker.log')
)

const PORT = process.env.PORT || '8080';

const fastify = Fastify({
    logger: true
})

fastify.get('/log', async function handler(request, reply) {
    try {
        const logPath = path.resolve(__dirname, '../worker.log');

        const logContent = await fs.readFile(logPath, 'utf-8')
        return { log: logContent }
    } catch (error) {
        console.log(error)
        reply.status(500)
        return { error: 'Could not read log file' }
    }
})


async function main() {
    try {

        const { agent, config, walletProvider } = await initializeAgent();
        // always run autonomous mode
        await runAutonomousMode(agent, config, walletProvider);

        fileLogger.info("Starting Server with Agent...");
        await fastify.listen({ port: Number(PORT) })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }

}



// Run the server!

if (require.main === module) {
    console.log("Starting Server with Agent...");
    main().catch(error => {
        console.error("Fatal error:", error);
        process.exit(1);
    });
}
