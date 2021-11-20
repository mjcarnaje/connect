import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import { IConnEvent } from "./types";

type IEvents = "enter_room";

const app = express();
const port = 3000;

app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "pug");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("index", { title: "Zoom Clone!" });
});

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

wsServer.on("connection", (socket) => {
  socket.onAny((event) => console.log(`Event: ${event}`));

  socket.on<IConnEvent>("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit<IConnEvent>("joined");
  });

  socket.on<IConnEvent>("disconnecting", () => {
    socket.rooms.forEach((room) => socket.to(room).emit<IConnEvent>("bye"));
  });

  socket.on<IConnEvent>("new_message", (newMessage, roomName, done) => {
    socket.to(roomName).emit<IConnEvent>("new_message", newMessage);
    done();
  });
});

httpServer.listen(port, () => {
  console.log(`Connected successfully on port ${port}`);
});
