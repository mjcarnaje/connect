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
  socket.on<IConnEvent>("enter_room", (roomName, done) => {
    console.log(roomName);
    setTimeout(() => done("hello from backend"), 3000);
  });
});

httpServer.listen(port, () => {
  console.log(`Connected successfully on port ${port}`);
});
