import http from "http";
import express, { Response } from "express";
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

server.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
