import { Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "../types";

type ISocketClient = Socket<ServerToClientEvents, ClientToServerEvents>;

// @ts-ignore
const socket: ISocketClient = io();

const welcome = document.getElementById("welcome") as HTMLElement;
const welcomeForm = welcome.querySelector("form") as HTMLFormElement;
const room = document.getElementById("room") as HTMLElement;
const roomMessageForm = room.querySelector("#message") as HTMLFormElement;
const roomNicknameForm = room.querySelector("#nickname") as HTMLFormElement;

room.hidden = true;

let roomName: string;

function addMessage(msg: string) {
  const ul = room.querySelector("ul") as HTMLUListElement;
  const li = document.createElement("li");
  li.innerText = msg;
  ul.appendChild(li);
}

function showRoom(roomName: string) {
  welcome.hidden = true;
  room.hidden = false;
  const roomTitle = room.querySelector("h3") as HTMLHeadingElement;
  roomTitle.innerText = `Room ${roomName}`;
}

welcomeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = welcomeForm.querySelector("input") as HTMLInputElement;

  roomName = input.value;

  socket.emit("enter_room", roomName, () => {
    showRoom(roomName);
  });

  input.value = "";
});

roomNicknameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = roomNicknameForm.querySelector("input") as HTMLInputElement;

  socket.emit("nickname", input.value);
});

roomMessageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = roomMessageForm.querySelector("input") as HTMLInputElement;
  const newMessage = input.value;

  socket.emit("new_message", newMessage, roomName, () => {
    addMessage(`You: ${newMessage}`);
  });

  input.value = "";
});

socket.on("joined", (user: string) => {
  addMessage(`${user}} joined!`);
});

socket.on("bye", (user: string) => {
  addMessage(`${user} left!`);
});

socket.on("new_message", (newMessage: string) => {
  addMessage(newMessage);
});
