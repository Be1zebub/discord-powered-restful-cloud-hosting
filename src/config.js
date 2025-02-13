import dotenv from "dotenv"
dotenv.config()

export const config = {
	discord: {
		token: process.env.DISCORD_TOKEN,
		channelId: process.env.DISCORD_CHANNEL_ID,
	},
	service: {
		domain: process.env.SERVICE_DOMAIN,
		protocol: process.env.PROTOCOL || "https",
		port: process.env.PORT || 3000,
	},
}
