import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"
import { ACCESS_LEVELS, JWT_ERRORS } from "../constants.js"
import { getUser, userExists } from "../db/users.js"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export function generateToken(userId) {
	return jwt.sign({ userId }, JWT_SECRET)
}

export function verifyToken(token) {
	try {
		return jwt.verify(token, JWT_SECRET)
	} catch (error) {
		return null
	}
}

export async function generateUserId() {
	let userId
	do {
		userId = uuidv4()
	} while (await userExists(userId))

	return userId
}

export async function checkPermissions(request, requiredLevel) {
	const authHeader = request.headers.authorization
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		throw new Error(JWT_ERRORS.MISSING_TOKEN)
	}

	const token = authHeader.substring(7)
	const decoded = verifyToken(token)
	if (!decoded) {
		throw new Error(JWT_ERRORS.INVALID_TOKEN)
	}

	const user = await getUser(decoded.userId)
	if (!user) {
		throw new Error(JWT_ERRORS.INVALID_TOKEN)
	}

	if (
		requiredLevel === ACCESS_LEVELS.ROOT &&
		user.access_level !== ACCESS_LEVELS.ROOT
	) {
		throw new Error(JWT_ERRORS.INSUFFICIENT_PERMISSIONS)
	}

	return user
}
