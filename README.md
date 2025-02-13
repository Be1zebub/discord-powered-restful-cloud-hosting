# Discord-powered RESTful cloud hosting

Simple RESTful API for storing and managing files using Discord as storage.

> [!NOTE]
> This project was an experiment in pair programming with AI (Cursor AI).  
> I acted as the software engineer - designing the architecture and orchestrating the AI,  
> while the AI helped with coding tasks.  
> 99% of the code was written by the AI.  
> Before working on this project, I considered ai to be nothing more than an auxiliary tool, like Google or stackoverflow.  
> I was wrong, with proper software engineer efforts, ai can become a useful tool.

> [!WARNING]
> "AI will replace programmers" - it's still a marketing scam. But with the right software engineering experience, AI can be a great tool.

> [!IMPORTANT]
> This project was created as an experiment and proof of concept.
> Using Discord as a file hosting service likely violates Discord's Terms of Service.
> This code is provided for educational purposes only.
> I take no responsibility for any malicious use of this codebase or potential Discord TOS violations.

## Features

- File upload and management through REST API
- Text and file storage using Discord as backend
- User management with root/user access levels
- JWT-based authentication
- Swagger documentation
- CLI interface (repl) for user management

## Prerequisites

- Node.js 18 or higher
- Discord bot token and channel id
- npm & nodejs

## Installation

1. Clone the repository

    ```bash
    git clone git@github.com:Be1zebub/discord-powered-restful-cloud-hosting.git
    cd discord-powered-restful-cloud-hosting
    ```

2. Install dependencies

    ```bash
    npm install
    ```

3. Create .env file from example

    ```bash
    cp .env.example .env
    ```

4. Configure environment variables in .env:
    - `DISCORD_TOKEN`: Your Discord bot token
    - `DISCORD_CHANNEL_ID`: Channel ID for file storage
    - `SERVICE_DOMAIN`: Your service domain (e.g. localhost:3000)
    - `PROTOCOL`: http or https
    - `PORT`: Service port (default: 3000)
    - `JWT_SECRET`: Secret key for JWT tokens (min 32 chars)

## Usage

Start the server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

### CLI Commands

The service includes a CLI interface for user management:

- `help` - Show available commands
- `register <accessLevel>` - Create new user (root/user)
- `users` - List all users
- `delete-user <userId>` - Delete user
- `uploads <userId>` - List user uploads
- `exit` - Exit CLI

### API Endpoints

Full API documentation is available at `/documentation` endpoint.

Main endpoints:

- `POST /files/upload` - Upload file or text
- `GET /files/:id` - Get file or text
- `POST /files/edit/:id` - Edit text content
- `POST /files/delete/:id` - Delete file
- `POST /users/register` - Create new user
- `GET /users/me` - Get current user info
- `GET /users/:id` - Get user info
- `GET /users/uploads/:id` - Get user uploads
- `POST /users/delete/:id` - Delete user

## License

MIT

## Development Note

This was an interesting experiment in working with AI. I took the role of software engineer -
making architectural decisions and directing the development, while using AI as a coding assistant.
Here's how we split the work:

Me (Engineer):

- System architecture and design
- Feature planning and requirements
- Code review and quality control
- Development orchestration

AI (Assistant):

- Code implementation
- Documentation writing
- Bug fixing
- API documentation

It turned out to be a really effective workflow - having AI handle the implementation details
while I focused on the bigger picture and architecture decisions.
