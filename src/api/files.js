import { ACCESS_LEVELS, HTTP_CODES } from "../constants.js"
import {
	handleDeleteMessage,
	handleEditMessage,
	handleFileUpload,
	handleGetMessage,
	handleTextUpload,
} from "../handlers/message.js"
import { checkPermissions } from "../utils/jwt.js"

export function registerFileRoutes(fastify, channel) {
	fastify.post("/files/upload", async (request, reply) => {
		try {
			const user = await checkPermissions(request, ACCESS_LEVELS.USER)

			if (!request.headers["content-type"]) {
				throw new Error("Content-Type header is required")
			}
			if (request.headers["content-type"].includes("text/plain")) {
				const result = await handleTextUpload(channel, request.body, user.id)
				return reply.send(result)
			}

			try {
				const parts = request.parts()
				let data

				for await (const part of parts) {
					if (part.type === "file") {
						data = part
						break
					}
				}

				if (!data) {
					return reply.send({ succ: false, reason: "No file provided" })
				}

				const result = await handleFileUpload(channel, data, user.id)
				return reply.send(result)
			} catch (err) {
				console.error("File upload error:", err)
				throw new Error("Invalid file upload. Use multipart/form-data")
			}
		} catch (error) {
			return reply.send({ succ: false, reason: error.message })
		}
	})

	fastify.get("/files/:messageId", async (request, reply) => {
		const result = await handleGetMessage(channel, request.params.messageId)

		if (!result.succ) {
			return reply.send(result)
		}

		if (result.redirectUrl) {
			return reply
				.code(HTTP_CODES.TEMPORARY_REDIRECT)
				.redirect(result.redirectUrl)
		}

		return reply.send(result)
	})

	fastify.post("/files/edit/:id", async (request, reply) => {
		try {
			const user = await checkPermissions(request, ACCESS_LEVELS.USER)
			const messageId = request.params.id
			const { text } = request.body

			if (!text) {
				return reply.send({
					succ: false,
					reason: "Text is required",
				})
			}

			const result = await handleEditMessage(
				channel,
				messageId,
				text,
				user.id,
				user.access_level === ACCESS_LEVELS.ROOT
			)
			return reply.send(result)
		} catch (error) {
			return reply.send({ succ: false, reason: error.message })
		}
	})

	fastify.post("/files/delete/:id", async (request, reply) => {
		try {
			const user = await checkPermissions(request, ACCESS_LEVELS.USER)
			const messageId = request.params.id

			const result = await handleDeleteMessage(
				channel,
				messageId,
				user.id,
				user.access_level === ACCESS_LEVELS.ROOT
			)
			return reply.send(result)
		} catch (error) {
			return reply.send({ succ: false, reason: error.message })
		}
	})
}
