import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const prisma = new PrismaClient();

export const socketHandler = (io) => {
  io.use((socket, next) => {
    let token;

    if (socket.handshake.auth?.token) {
      token = socket.handshake.auth.token;
    }
    else if (socket.handshake.headers.cookie) {
      const cookies = cookie.parse(socket.handshake.headers.cookie);
      token = cookies.accessToken;
    }

    if (!token) {
      return next(new Error("Unauthorized: No token provided"));
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      socket.userId = payload.id;
      next();
    } catch (err) {
      return next(new Error("Unauthorized: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id, "user:", socket.userId);

    socket.on("join-team", async (teamId) => {
      if (!teamId) return;

      const user = await prisma.user.findUnique({
        where: { id: socket.userId },
        select: { teamId: true },
      });

      if (user?.teamId !== teamId) {
        const team = await prisma.team.findUnique({
          where: { id: teamId },
        });
        if (!team || team.owner !== socket.userId) return console.log("user not authorized to join this team");
      }

      socket.join(`team:${teamId}`);
      console.log(`User ${socket.userId} joined team:${teamId}`);
    });


    socket.on("send-message", async ({ content, teamId }) => {
      if (!teamId) {
        return socket.emit("error", { message: "Missing teamId" });
      }

      if (!socket.rooms.has(`team:${teamId}`)) {
        return socket.emit("error", { message: "Join the team first" });
      }

      try {
        const newMessage = await prisma.message.create({
          data: {
            content: content,
            teamId,
            senderId: socket.userId,
          },
          include: {
            sender: {
              select: { id: true, name: true, email: true },
            },
          },
        });

        io.to(`team:${teamId}`).emit("receive-message", newMessage);
      } catch (err) {
        console.error("Send message error:", err.message);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("mark-message-read", async ({ messageId }) => {
      if (!messageId) return;

      try {
        const readReceipt = await prisma.messageRead.upsert({
          where: {
            messageId_userId: {
              messageId,
              userId: socket.userId,
            },
          },
          update: {},
          create: {
            messageId,
            userId: socket.userId,
          },
          include: {
            message: {
              select: { teamId: true },
            },
          },
        });

        const teamId = readReceipt.message?.teamId;
        if (!teamId) return;

        if (!socket.rooms.has(`team:${teamId}`)) return;

        io.to(`team:${teamId}`).emit("message-read-update", {
          messageId,
          userId: socket.userId,
          readAt: readReceipt.readAt,
        });
      } catch (err) {
        console.error("Mark read error:", err.message);
      }
    });

    socket.on("disconnect", async () => {
      console.log("Socket disconnected:", socket.id);

      try {
        await prisma.user.update({
          where: { id: socket.userId },
          data: { lastSeen: new Date() },
        });
      } catch (err) {
        console.error("Update lastSeen error:", err.message);
      }
    });
  });
};
