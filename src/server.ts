import "dotenv/config";
import http from "http";
import express from "express";
import path from "path";
import WebSocket from "ws";

const app = express();

app.use(express.static(path.join(__dirname + "/../client/public")));

// app.listen(process.env.PORT, () => {
//   console.log("Server running on port " + process.env.PORT);
// });

const server = http.createServer(app);

// You don't have to pass the server, we just pass the server so that the can run in the same port
const wss = new WebSocket.Server({ server });

type ISocket = WebSocket & { nickname: string };

const sockets: WebSocket[] = [];

wss.on("connection", (socket: ISocket) => {
  // save / push every browser connection
  sockets.push(socket);

  socket["nickname"] = "Anonymous";

  console.log("Connected to Browser ✔!!");

  socket.on("message", (msg) => {
    const message = JSON.parse(msg.toString());

    console.log(msg.toString());

    switch (message.type) {
      case "newMessage":
        // send to each browser
        sockets.forEach((conn) => {
          conn.send(`${socket.nickname}: ${message.payload}`);
        });
        break;
      case "nickname":
        socket["nickname"] = message.payload;
        break;
      default:
        break;
    }
  });

  socket.on("close", () => console.log("Disconnected from Browswer ❌!!"));
});

server.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
