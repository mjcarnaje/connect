import http from "http";
import express from "express";
import env from "dotenv";
import WebSocket from "ws";

env.config();

const app = express();

app.use(express.static(__dirname + "/public"));

// app.listen(process.env.PORT, () => {
//   console.log("Server running on port " + process.env.PORT);
// });

const server = http.createServer(app);

// You don't have to pass the server, we just pass the server so that the can run in the same port
const wss = new WebSocket.Server({ server });

type ISocket = WebSocket & { nickname: string };

const sockets: WebSocket[] = [];

wss.on("connection", (socket: ISocket) => {
  sockets.push(socket);
  socket["nickname"] = "Anonymous";
  console.log("Connected to Browser ✔!!");
  socket.on("close", () => console.log("Disconnected from Browswer ❌!!"));
  socket.on("message", (msg) => {
    const message = JSON.parse(msg.toString());
    switch (message.type) {
      case "newMessage":
        sockets.forEach((_socket) => {
          _socket.send(`${socket.nickname}: ${message.payload}`);
        });
        break;
      case "nickname":
        socket["nickname"] = message.payload;
        break;
      default:
        break;
    }
  });
});

server.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
