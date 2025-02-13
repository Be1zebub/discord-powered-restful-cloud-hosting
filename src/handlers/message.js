import { config } from "../config.js"
import { MESSAGE_TYPES } from "../constants.js"
import { deleteFile, getFile, saveFile } from "../db/files.js"
import { validateFile, validateText } from "../utils/validation.js"

export async function handleTextUpload(channel, text, uploaderId) {
	const validation = validateText(text)
	if (!validation.valid) {
		return { succ: false, reason: validation.reason }
	}

	try {
		const message = await channel.send(text)
		await saveFile(message.id, MESSAGE_TYPES.TEXT, uploaderId)

		return {
			succ: true,
			url: `${config.service.protocol}://${config.service.domain}/files/${message.id}`,
		}
	} catch (error) {
		return { succ: false, reason: error.message }
	}
}

export async function handleFileUpload(channel, file, uploaderId) {
	const validation = validateFile(file)
	if (!validation.valid) {
		return { succ: false, reason: validation.reason }
	}

	try {
		const message = await channel.send({
			files: [
				{
					attachment: await file.toBuffer(),
					name: file.filename,
				},
			],
		})

		const type = file.mimetype.startsWith("image/")
			? MESSAGE_TYPES.IMAGE
			: MESSAGE_TYPES.FILE

		await saveFile(message.id, type, uploaderId)

		return {
			succ: true,
			url: `${config.service.protocol}://${config.service.domain}/files/${message.id}`,
		}
	} catch (error) {
		return { succ: false, reason: error.message }
	}
}

export async function handleGetMessage(channel, messageId) {
	try {
		const dbFile = await getFile(messageId)
		if (!dbFile) {
			return { succ: false, reason: "File not found" }
		}

		const message = await channel.messages.fetch(messageId)
		if (!message) {
			return { succ: false, reason: "File not found on storage" }
		}

		if (dbFile.type === MESSAGE_TYPES.TEXT) {
			return { succ: true, content: message.content }
		} else {
			const attachment = message.attachments.first()
			return {
				succ: true,
				redirectUrl: attachment.url,
				type: dbFile.type,
			}
		}
	} catch (error) {
		return { succ: false, reason: error.message }
	}
}

export async function handleEditMessage(
	channel,
	messageId,
	text,
	userId,
	isRoot
) {
	try {
		const dbFile = await getFile(messageId)
		if (!dbFile) {
			return { succ: false, reason: "File not found" }
		}

		if (dbFile.uploader_id !== userId && !isRoot) {
			return { succ: false, reason: "Not authorized to edit this file" }
		}

		if (dbFile.type !== MESSAGE_TYPES.TEXT) {
			return { succ: false, reason: "Can only edit text files" }
		}

		const validation = validateText(text)
		if (!validation.valid) {
			return { succ: false, reason: validation.reason }
		}

		const message = await channel.messages.fetch(messageId)
		if (!message) {
			return { succ: false, reason: "File not found on storage" }
		}

		await message.edit(text)
		return { succ: true }
	} catch (error) {
		return { succ: false, reason: error.message }
	}
}

export async function handleDeleteMessage(channel, messageId, userId, isRoot) {
	try {
		const dbFile = await getFile(messageId)
		if (!dbFile) {
			return { succ: false, reason: "File not found" }
		}

		if (dbFile.uploader_id !== userId && !isRoot) {
			return { succ: false, reason: "Not authorized to delete this file" }
		}

		const message = await channel.messages.fetch(messageId)
		if (!message) {
			return { succ: false, reason: "File not found on storage" }
		}

		await message.delete()
		await deleteFile(messageId)
		return { succ: true }
	} catch (error) {
		return { succ: false, reason: error.message }
	}
}
