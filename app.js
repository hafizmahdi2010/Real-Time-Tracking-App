const express = require('express');
const http = require('http');
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Socket.io basics
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

// Ejs configuration
app.set("view engine", "ejs");

// Static files middleware
app.use(express.static(path.join(__dirname, "public")));

// Socket.io connection
io.on("connection", (socket) => {
  console.log("New User Connected");
  socket.on("send-location", (data) => {
    io.emit("receive-location", {id: socket.id, ...data});
  });
  socket.on("disconnect", () => {
    console.log("User Disconnected"); 
    io.emit("user-disconnected", socket.id);
  });
});

app.get("/", (req, res) => {
  res.render("index");
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
