import { ACCESS_LEVELS } from "../constants.js"
import { getUserUploads } from "../db/files.js"
import { createUser, deleteUser, getUser } from "../db/users.js"
import {
	checkPermissions,
	generateToken,
	generateUserId,
} from "../utils/jwt.js"

export function registerUserRoutes(fastify) {
	fastify.get("/users/me", async (request, reply) => {
		try {
			const user = await checkPermissions(request, ACCESS_LEVELS.USER)
			return reply.send({
				succ: true,
				user: {
					id: user.id,
					access_level: user.access_level,
					created_at: user.created_at,
				},
			})
		} catch (error) {
			return reply.send({ succ: false, reason: error.message })
		}
	})

	fastify.get("/users/uploads/:id", async (request, reply) => {
		try {
			const user = await checkPermissions(request, ACCESS_LEVELS.USER)
			const targetId = request.params.id

			if (user.access_level !== ACCESS_LEVELS.ROOT && user.id !== targetId) {
				return reply.send({
					succ: false,
					reason: "Not authorized to view these uploads",
				})
			}

			const uploads = await getUserUploads(targetId)
			return reply.send({
				succ: true,
				uploads: uploads.map((upload) => ({
					id: upload.id,
					type: upload.type,
					created_at: upload.created_at,
				})),
			})
		} catch (error) {
			return reply.send({ succ: false, reason: error.message })
		}
	})

	fastify.get("/users/:id", async (request, reply) => {
		try {
			const user = await checkPermissions(request, ACCESS_LEVELS.USER)
			const targetId = request.params.id

			if (user.access_level !== ACCESS_LEVELS.ROOT && user.id !== targetId) {
				return reply.send({
					succ: false,
					reason: "Not authorized to view this user",
				})
			}

			const targetUser = await getUser(targetId)
			if (!targetUser) {
				return reply.send({ succ: false, reason: "User not found" })
			}

			return reply.send({
				succ: true,
				user: {
					id: targetUser.id,
					access_level: targetUser.access_level,
					created_at: targetUser.created_at,
				},
			})
		} catch (error) {
			return reply.send({ succ: false, reason: error.message })
		}
	})

	fastify.post("/users/register", async (request, reply) => {
		try {
			await checkPermissions(request, ACCESS_LEVELS.ROOT)

			const { accessLevel } = request.body

			if (!Object.values(ACCESS_LEVELS).includes(accessLevel)) {
				return reply.send({
					succ: false,
					reason: "Invalid access level. Use: 'user' or 'root'",
				})
			}

			const userId = await generateUserId()
			await createUser(userId, accessLevel)
			const token = generateToken(userId)

			return reply.send({ succ: true, token })
		} catch (error) {
			return reply.send({ succ: false, reason: error.message })
		}
	})

	fastify.post("/users/delete/:id", async (request, reply) => {
		try {
			await checkPermissions(request, ACCESS_LEVELS.ROOT)
			const targetId = request.params.id

			await deleteUser(targetId)
			return reply.send({ succ: true })
		} catch (error) {
			return reply.send({ succ: false, reason: error.message })
		}
	})
}
