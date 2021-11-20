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

  socket.on("enter_room", (nickname, roomId, done) => {
    socket.data.nickname = nickname;

    socket.join(roomId);

    done();

    socket.to(roomId).emit("joined", nickname);
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.data.nickname)
    );
  });

  socket.on("new_message", (newMessage, roomId, done) => {
    socket
      .to(roomId)
      .emit("new_message", `${socket.data.nickname}: ${newMessage}`);
    done();
  });

  socket.on("nickname", (nickname: string) => {
    socket.data.nickname = nickname;
  });
});

httpServer.listen(port, () => {
  console.log(`Connected successfully on port ${port}`);
});
