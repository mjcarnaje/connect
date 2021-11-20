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

  function publicRooms(): string[] {
    const { sids, rooms } = io.sockets.adapter;
    const public_rooms: string[] = [];
    rooms.forEach((_, key) => {
      if (!sids.get(key)) {
        public_rooms.push(key);
      }
    });
    return public_rooms;
  }

  function countActive(roomName: string) {
    return io.sockets.adapter.rooms.get(roomName)?.size || 0;
  }

  socket.onAny((event) => console.log(`Event: ${event}`));

  socket.on("enter_room", (nickname, roomId, done) => {
    socket.data.nickname = nickname;

    socket.join(roomId);

    done(countActive(roomId));

    socket.to(roomId).emit("welcome", nickname, countActive(roomId));

    io.sockets.emit("new_rooms", publicRooms());
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket
        .to(room)
        .emit("leave_room", socket.data.nickname, countActive(room) - 1)
    );
  });

  socket.on("disconnect", () => {
    io.sockets.emit("new_rooms", publicRooms());
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
