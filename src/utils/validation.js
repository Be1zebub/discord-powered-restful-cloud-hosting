import { DISCORD_LIMITS } from "../constants.js"

export function validateText(text) {
	if (!text) {
		return { valid: false, reason: "Text content is required" }
	}

	if (text.length > DISCORD_LIMITS.MAX_TEXT_LENGTH) {
		return {
			valid: false,
			reason: `Text length exceeds Discord limit of ${DISCORD_LIMITS.MAX_TEXT_LENGTH} characters`,
		}
	}

	return { valid: true }
}

export function validateFile(file) {
	if (!file) {
		return { valid: false, reason: "File is required" }
	}

	if (file.file.length > DISCORD_LIMITS.MAX_FILE_SIZE) {
		return {
			valid: false,
			reason: `File size exceeds Discord limit of ${DISCORD_LIMITS.MAX_FILE_SIZE} bytes`,
		}
	}

	return { valid: true }
}
