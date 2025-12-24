import express from "express"
import http from "http"
import { Server } from "socket.io"
import { config } from "dotenv"
import { connectDB, disconnectDB } from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import taskListRoutes from "./routes/taskListRoutes.js"
import inviteRoutes from "./routes/inviteRoutes.js"
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"
import { startInviteCleanupJob } from "./jobs/cleanupInvites.js"
import cookieParser from "cookie-parser"
import swaggerUi from "swagger-ui-express"
import swaggerSpec from "./swagger.js"
import messageRoutes from "./routes/messageRoutes.js"
import { socketHandler } from "./sockets/socketHandler.js"

config()
connectDB()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

startInviteCleanupJob()

// Routes
app.use("api/auth", authRoutes)
app.use("api/task-list", taskListRoutes)
app.use("api/team", inviteRoutes)
app.use("api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use("api/messages", messageRoutes)

// Error handling
app.use(notFound)
app.use(errorHandler)

// Create HTTP server
const server = http.createServer(app)

// Attach socket.io (IDLE unless chat connects)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
})

// Socket logic (MESSAGES ONLY)
socketHandler(io)

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

// Process handlers
process.on("unhandledRejection", (err) => {
  console.log(`Unhandled Rejection: ${err}`)
  server.close(async () => {
    await disconnectDB()
    process.exit(1)
  })
})

process.on("uncaughtException", async (err) => {
  console.log(`Uncaught Exception: ${err}`)
  server.close(async () => {
    await disconnectDB()
    process.exit(1)
  })
})

process.on("SIGTERM", async () => {
  console.log("SIGTERM received: shutting down gracefully...")
  server.close(async () => {
    await disconnectDB()
    process.exit(0)
  })
})
