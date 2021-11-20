import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./types";

const app = express();
const port = 3000;

app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "pug");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("index", { title: "Hello, Connect!" });
});

const httpServer = http.createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents, SocketData>(
  httpServer
);

io.on("connection", (socket) => {
  socket.data.nickname = "Anonymous";

  socket.onAny((event) => console.log(`Event: ${event}`));

  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();

    socket.to(roomName).emit("joined", socket.data.nickname);
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.data.nickname)
    );
  });

  socket.on("new_message", (newMessage, roomName, done) => {
    socket
      .to(roomName)
      .emit("new_message", `${socket.data.nickname}: ${newMessage}}`);
    done();
  });

  socket.on("nickname", (nickname: string) => {
    socket.data.nickname = nickname;
  });
});

httpServer.listen(port, () => {
  console.log(`Connected successfully on port ${port}`);
});
