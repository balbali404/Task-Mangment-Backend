# Task Management Application

A robust Task Management API built with Node.js, Express, Prisma (PostgreSQL), and Socket.io. This application supports user authentication, team collaboration, task tracking, and real-time messaging.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication with cookie support.
- **Team Management**: Create teams, invite members via email, and manage roles.
- **Task Tracking**: Create, update, delete, and view tasks (referred to as "Task Lists" in endpoints).
- **Real-time Messaging**: Instant messaging within teams using Socket.io.
- **Read Receipts**: Track who has read messages in real-time.
- **Swagger Documentation**: Interactive API documentation.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Real-time**: Socket.io
- **Validation**: Zod
- **Documentation**: Swagger UI
- **Security**: bcryptjs, jsonwebtoken, cookie-parser, helmet (implied good practice, though not explicitly seen in package.json, `cookie-parser` is used)

## 📋 Prerequisites

- **Node.js** (v16+ recommended)
- **PostgreSQL** database
- **NPM** or **Yarn**

## 🔧 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd task-management
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory and configure the following variables:

   ```env
   # Server Configuration
   PORT=3000

   # Database Configuration
   DATABASE_URL="postgresql://user:password@localhost:5432/task_db?schema=public"

   # Security
   JWT_SECRET="your_super_secret_key"

   # Note: Ensure you have your database running before proceeding.
   ```

4. **Database Migration**
   Push the Prisma schema to your database:

   ```bash
   npx prisma db push
   # or
   npx prisma migrate dev --name init
   ```

5. **Start the Server**

   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

## 📖 API Documentation

The API allows you to manage users, teams, tasks, and messages.

**Interactive Docs:** Visit `http://localhost:3000/api-docs` after starting the server to see the full Swagger documentation.

### 🔐 Authentication (`api/auth`)

| Method | Endpoint         | Description                   |
| :----- | :--------------- | :---------------------------- |
| `POST` | `api/auth/register` | Register a new user.          |
| `POST` | `api/auth/login`    | Login user and receive JWT.   |
| `POST` | `api/auth/logout`   | Logout user (clears cookies). |

### 📝 Tasks (`/task-list`)

_Requires Authentication_

| Method   | Endpoint         | Description                                   |
| :------- | :--------------- | :-------------------------------------------- |
| `POST`   | `api/task-list`     | Create a new task.                            |
| `GET`    | `api/task-list`     | Get all tasks for the logged-in user or team. |
| `GET`    | `api/task-list/:id` | Get specific task details.                    |
| `PUT`    | `api/task-list/:id` | Update a task.                                |
| `DELETE` | `api/task-list/:id` | Delete a task.                                |

### 👥 Teams & Invites (`api/team`)

_Requires Authentication_

| Method | Endpoint              | Description                               |
| :----- | :-------------------- | :---------------------------------------- |
| `POST` | `api/team/invite`        | Generate a team invite.                   |
| `GET`  | `api/team/invite`        | Get pending invites for the user.         |
| `POST` | `api/team/invite/verify` | Verify an invite token.                   |
| `PUT`  | `api/team/invite/:id?status=ACCEPTED`    | Respond to a team invite (status can be (ACCEPTED/REJECTED)). |

### 💬 Messages (`api/messages`)

_Requires Authentication_

| Method | Endpoint            | Description                              |
| :----- | :------------------ | :--------------------------------------- |
| `GET`  | `api/messages/:teamId` | Get message history for a specific team. |

## 🔌 Socket.io Events (Real-time)

The application uses Socket.io for real-time features. Connect to the base URL (`/`) with a valid JWT token.

### Client -> Server (Emitted by Client)

- **`join-team`**: Join a specific team channel.
  - Payload: `teamId` (String)
- **`send-message`**: Send a message to the team.
  - Payload: `{ content: "Hello", teamId: "uuid" }`
- **`mark-message-read`**: Mark a message as read.
  - Payload: `{ messageId: "uuid" }`

### Server -> Client (Listened by Client)

- **`receive-message`**: Triggered when a new message is posted in the team.
  - Payload: `Message` object
- **`message-read-update`**: Triggered when a user reads a message.
  - Payload: `{ messageId, userId, readAt }`
- **`error`**: Triggered on failure.
  - Payload: `{ message: "Error description" }`

## 📂 Project Structure

```
src/
├── config/         # Database and app configuration
├── controllers/    # Route logic
├── middleware/     # Auth and validation middleware
├── routes/         # API routes definitions
├── services/       # Business logic (if any)
├── sockets/        # Socket.io handlers
├── validators/     # Zod validation schemas
├── server.js       # Entry point
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
