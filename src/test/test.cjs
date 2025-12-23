const { io } = require("socket.io-client");

// ======== CONFIGURE ME ========
const SERVER_URL = "http://localhost:3000";       // Your backend Socket.IO server
const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImEyYmU2ZDkyLTgxNjgtNGIzZS05ZDI2LTAwNDY1YTdmZGZlMCIsImlhdCI6MTc2NjUwMTIwMywiZXhwIjoxNzY3MTA2MDAzfQ.ZIA6dfGBAA1iVGLSGDTzBRJCJ0YxK8VXGLpS04y-TSY";               // Paste your JWT token here!
const TEAM_ID = "1e98ec50-125e-4442-bf1b-1a4da50c1a3a";              // Team ID as string
const USER_ID = "a2be6d92-8168-4b3e-9d26-00465a7fdfe0";              // Should match JWT's user

// ======== SETUP SOCKET ========
const socket = io(SERVER_URL, {
  auth: { token: JWT }
  // If you want to test sending a cookie instead, you can add:
  // extraHeaders: { cookie: `jwt=${JWT}` }
});

// ======== EVENT HANDLERS ========

socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);

  // Join the team (room)
  socket.emit("join-team", TEAM_ID);

  // Send a chat message
  setTimeout(() => {
    socket.emit("send-message", {
      content: "Hello from Node.js test script! 2",
      teamId: TEAM_ID,
      senderId: USER_ID
    });
  }, 1000); // Wait a moment to ensure join-team finished
});

// Listen for messages from the server
socket.on("receive-message", (msg) => {
  console.log("💬 Received message:", msg);
});

// Listen for possible errors sent by server
socket.on("error", (err) => {
  console.error("❌ Error from server:", err);
});

socket.on("disconnect", (reason) => {
  console.log("🚫 Disconnected:", reason);
});

// For message-read update
socket.on("message-read-update", (data) => {
  console.log("📬 Message read update:", data);
});