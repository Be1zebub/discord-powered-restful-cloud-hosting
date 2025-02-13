export const MESSAGE_TYPES = {
	TEXT: "text",
	IMAGE: "image",
	FILE: "file",
}

export const DISCORD_LIMITS = {
	MAX_TEXT_LENGTH: 2000,
	MAX_FILE_SIZE: 25 * 1024 * 1024, // 25MB
	MAX_IMAGE_SIZE: 25 * 1024 * 1024, // 25MB
}

export const HTTP_CODES = {
	TEMPORARY_REDIRECT: 307,
}

export const ACCESS_LEVELS = {
	USER: "user",
	ROOT: "root",
}

export const JWT_ERRORS = {
	INVALID_TOKEN: "Invalid token",
	MISSING_TOKEN: "Missing token",
	INSUFFICIENT_PERMISSIONS: "Insufficient permissions",
}
