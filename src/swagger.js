export const swaggerOptions = {
	swagger: {
		info: {
			title: "Discord-powered Restful Hosting",
			description:
				"RESTful API for storing and managing files using Discord as storage",
			version: "1.0.0",
		},
		host: process.env.SERVICE_DOMAIN,
		schemes: [process.env.PROTOCOL || "https"],
		consumes: ["multipart/form-data", "text/plain", "application/json"],
		produces: ["application/json"],
		securityDefinitions: {
			Bearer: {
				type: "apiKey",
				name: "Authorization",
				in: "header",
				description: "Enter the token with the `Bearer: ` prefix",
			},
		},
		tags: [
			{ name: "users", description: "User management endpoints" },
			{ name: "files", description: "File management endpoints" },
		],
		paths: {
			"/users/register": {
				post: {
					tags: ["users"],
					summary: "Create new user",
					description: "Create new user (requires ROOT access)",
					security: [{ Bearer: [] }],
					parameters: [
						{
							name: "accessLevel",
							in: "body",
							required: true,
							schema: {
								type: "string",
								enum: ["user", "root"],
							},
							description: "User access level",
						},
					],
					responses: {
						200: {
							description: "User created successfully",
							schema: {
								type: "object",
								properties: {
									succ: { type: "boolean" },
									token: { type: "string" },
									reason: { type: "string" },
								},
							},
						},
					},
				},
			},
			"/users/delete/{id}": {
				post: {
					tags: ["users"],
					summary: "Delete user",
					security: [{ Bearer: [] }],
					parameters: [
						{
							name: "id",
							in: "path",
							required: true,
							type: "string",
							description: "User ID to delete",
						},
					],
					responses: {
						200: {
							description: "User deleted successfully",
							schema: {
								type: "object",
								properties: {
									succ: { type: "boolean" },
									reason: { type: "string" },
								},
							},
						},
					},
				},
			},
			"/files/upload": {
				post: {
					tags: ["files"],
					summary: "Upload file or text",
					description: "Upload file or text content (requires USER access)",
					security: [{ Bearer: [] }],
					consumes: ["multipart/form-data", "text/plain"],
					parameters: [
						{
							name: "file",
							in: "formData",
							type: "file",
							description: "File to upload",
							required: false,
						},
						{
							name: "body",
							in: "body",
							required: false,
							description: "Text content to upload",
							schema: {
								type: "string",
							},
						},
					],
					responses: {
						200: {
							description: "Upload successful",
							schema: {
								type: "object",
								properties: {
									succ: { type: "boolean" },
									url: { type: "string" },
									reason: { type: "string" },
								},
							},
						},
					},
				},
			},
			"/files/{messageId}": {
				get: {
					tags: ["files"],
					summary: "Get file or text content",
					description: "Get file or text content (no authentication required)",
					parameters: [
						{
							name: "messageId",
							in: "path",
							required: true,
							type: "string",
							description: "Message ID",
						},
					],
					responses: {
						200: {
							description: "Content retrieved successfully",
							schema: {
								type: "object",
								properties: {
									succ: { type: "boolean" },
									content: { type: "string" },
									redirectUrl: { type: "string" },
									type: { type: "string" },
									reason: { type: "string" },
								},
							},
						},
						307: {
							description: "Redirect to file URL",
						},
					},
				},
			},
			"/files/edit/{id}": {
				post: {
					tags: ["files"],
					summary: "Edit text content",
					description:
						"Edit text content (requires USER access, owner or ROOT)",
					security: [{ Bearer: [] }],
					parameters: [
						{
							name: "id",
							in: "path",
							required: true,
							type: "string",
							description: "File ID to edit",
						},
						{
							name: "body",
							in: "body",
							required: true,
							schema: {
								type: "object",
								required: ["text"],
								properties: {
									text: {
										type: "string",
										description: "New text content",
									},
								},
							},
						},
					],
					responses: {
						200: {
							description: "Edit successful",
							schema: {
								type: "object",
								properties: {
									succ: { type: "boolean" },
									reason: { type: "string" },
								},
							},
						},
					},
				},
			},
			"/files/delete/{id}": {
				post: {
					tags: ["files"],
					summary: "Delete file or text",
					description:
						"Delete file or text (requires USER access, owner or ROOT)",
					security: [{ Bearer: [] }],
					parameters: [
						{
							name: "id",
							in: "path",
							required: true,
							type: "string",
							description: "File ID to delete",
						},
					],
					responses: {
						200: {
							description: "Delete successful",
							schema: {
								type: "object",
								properties: {
									succ: { type: "boolean" },
									reason: { type: "string" },
								},
							},
						},
					},
				},
			},
			"/users/me": {
				get: {
					tags: ["users"],
					summary: "Get current user information",
					description: "Get current user information (requires USER access)",
					security: [{ Bearer: [] }],
					responses: {
						200: {
							description: "User information retrieved successfully",
							schema: {
								type: "object",
								properties: {
									succ: { type: "boolean" },
									user: {
										type: "object",
										properties: {
											id: { type: "string" },
											access_level: { type: "string" },
											created_at: { type: "string" },
										},
									},
									reason: { type: "string" },
								},
							},
						},
					},
				},
			},
			"/users/uploads/{id}": {
				get: {
					tags: ["users"],
					summary: "Get user uploads",
					description:
						"Get user uploads (requires USER access, only own uploads or ROOT access)",
					security: [{ Bearer: [] }],
					parameters: [
						{
							name: "id",
							in: "path",
							required: true,
							type: "string",
							description: "User ID whose uploads to retrieve",
						},
					],
					responses: {
						200: {
							description: "User uploads retrieved successfully",
							schema: {
								type: "object",
								properties: {
									succ: { type: "boolean" },
									uploads: {
										type: "array",
										items: {
											type: "object",
											properties: {
												id: { type: "string" },
												type: { type: "string" },
												created_at: { type: "string" },
											},
										},
									},
									reason: { type: "string" },
								},
							},
						},
					},
				},
			},
			"/users/{id}": {
				get: {
					tags: ["users"],
					summary: "Get user information",
					description:
						"Get user information (requires USER access, only own info or ROOT access)",
					security: [{ Bearer: [] }],
					parameters: [
						{
							name: "id",
							in: "path",
							required: true,
							type: "string",
							description: "User ID to retrieve",
						},
					],
					responses: {
						200: {
							description: "User information retrieved successfully",
							schema: {
								type: "object",
								properties: {
									succ: { type: "boolean" },
									user: {
										type: "object",
										properties: {
											id: { type: "string" },
											access_level: { type: "string" },
											created_at: { type: "string" },
										},
									},
									reason: { type: "string" },
								},
							},
						},
					},
				},
			},
		},
	},
}

export const swaggerUiOptions = {
	routePrefix: "/documentation",
	exposeRoute: true,
}
