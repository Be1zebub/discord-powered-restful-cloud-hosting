import readline from "node:readline"
import { ACCESS_LEVELS } from "./constants.js"
import { getUserUploads } from "./db/files.js"
import { createUser, deleteUser, listUsers } from "./db/users.js"
import { generateToken, generateUserId } from "./utils/jwt.js"

const commands = []

commands.push({
	name: "help",
	desc: "Show help message. Usage: help [command]",
	cback(args) {
		const [commandName] = args

		if (commandName) {
			const cmd = commands.find((c) => c.name === commandName)
			if (cmd) {
				console.log(`\n${cmd.desc}\n`)
			} else {
				console.log(
					`\nUnknown command '${commandName}'. Type 'help' for available commands\n`
				)
			}
			return
		}

		console.log("\nAvailable commands:")
		commands.forEach(({ name, desc }) => {
			// Показываем только первое предложение для краткости в общем списке
			const shortDesc = desc.split(".")[0]
			console.log(`  ${name.padEnd(15)} : ${shortDesc}`)
		})
		console.log()
	},
})

commands.push({
	name: "register",
	desc: "Create new user. Usage: register <accessLevel>",
	async cback(args) {
		const [accessLevel] = args
		if (!Object.values(ACCESS_LEVELS).includes(accessLevel)) {
			console.error("Invalid access level. Use: 'user' or 'root'")
			return
		}

		const userId = await generateUserId()
		await createUser(userId, accessLevel)
		const token = generateToken(userId)

		console.log("User created successfully:")
		console.log("ID:", userId)
		console.log("Access Level:", accessLevel)
		console.log("Token:", token)
	},
})

commands.push({
	name: "users",
	desc: "List all users",
	async cback() {
		const users = await listUsers()
		console.table(
			users.map((user) => ({
				id: user.id,
				access_level: user.access_level,
				created_at: user.created_at,
			}))
		)
	},
})

commands.push({
	name: "delete-user",
	desc: "Delete user by ID. Usage: delete-user <userId>",
	async cback(args) {
		const [userId] = args
		if (!userId) {
			console.error("User ID is required")
			return
		}

		try {
			await deleteUser(userId)
			console.log("User deleted successfully")
		} catch (error) {
			console.error("Failed to delete user:", error.message)
		}
	},
})

commands.push({
	name: "uploads",
	desc: "List user uploads. Usage: uploads <userId>",
	async cback(args) {
		const [userId] = args
		if (!userId) {
			console.error("User ID is required")
			return
		}

		try {
			const uploads = await getUserUploads(userId)
			if (uploads.length === 0) {
				console.log("No uploads found")
				return
			}

			console.table(
				uploads.map((upload) => ({
					id: upload.id,
					timestamp: new Date(upload.created_at * 1000).toLocaleString(),
				}))
			)
		} catch (error) {
			console.error("Failed to get uploads:", error.message)
		}
	},
})

commands.push({
	name: "exit",
	desc: "Exit the program",
	cback() {
		process.exit(0)
	},
})

export function startRepl() {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		prompt: "> ",
	})

	rl.prompt()
	console.log("type help for available commands")

	rl.on("line", async (line) => {
		const [command, ...args] = line.trim().split(/\s+/)

		const cmd = commands.find((c) => c.name === command)
		if (cmd) {
			try {
				await cmd.cback(args)
			} catch (error) {
				console.error("Error:", error.message)
			}
		} else if (command) {
			console.log("Unknown command. Type 'help' for available commands")
		}

		rl.prompt()
	})

	rl.on("close", () => {
		console.log("\nGoodbye!")
		process.exit(0)
	})
}
