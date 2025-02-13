import multipart from "@fastify/multipart"
import swagger from "@fastify/swagger"
import swaggerUi from "@fastify/swagger-ui"
import { Client, GatewayIntentBits } from "discord.js"
import Fastify from "fastify"
import { registerFileRoutes } from "./api/files.js"
import { registerUserRoutes } from "./api/users.js"
import { config } from "./config.js"
import "./db/files.js"
import "./db/users.js"
import { startRepl } from "./repl.js"
import { swaggerOptions, swaggerUiOptions } from "./swagger.js"

const fastify = Fastify({ logger: true })
const discord = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
})

await discord.login(config.discord.token)
const channel = await discord.channels.fetch(config.discord.channelId)

fastify.register(multipart, {
	limits: {
		fileSize: 10_000_000, // 10mb
		files: 1, // max 1 file
	},
})
fastify.register(swagger, swaggerOptions)
fastify.register(swaggerUi, swaggerUiOptions)

registerUserRoutes(fastify)
registerFileRoutes(fastify, channel)

try {
	await fastify.listen({ port: config.service.port, host: "0.0.0.0" })
	startRepl()
} catch (err) {
	fastify.log.error(err)
	process.exit(1)
}
