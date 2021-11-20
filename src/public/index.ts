import { Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "../types";

type ISocketClient = Socket<ServerToClientEvents, ClientToServerEvents>;

// @ts-ignore
const socket: ISocketClient = io();

const welcomeDiv = getElement("welcome");
const roomDiv = getElement("room");

const enterRoomForm = welcomeDiv.querySelector("#enterRoom") as HTMLFormElement;
const roomMessageForm = roomDiv.querySelector("#message") as HTMLFormElement;

let roomId: string;
roomDiv.hidden = true;

enterRoomForm.addEventListener("submit", handleEnterRoomSubmit);
roomMessageForm.addEventListener("submit", handleNewMessageSubmit);

function handleEnterRoomSubmit(event: Event) {
  event.preventDefault();

  const nickname = getElement("nickname").value;
  const _roomId = getElement("roomId").value;

  roomId = _roomId;

  socket.emit("enter_room", nickname, _roomId, () => {
    showRoom(roomId);
  });
}

function handleNewMessageSubmit(event: Event) {
  event.preventDefault();

  const newMessage = getElement("newMessage").value;

  socket.emit("new_message", newMessage, roomId, () => {
    addMessage(`You: ${newMessage}`);
  });

  getElement("newMessage").value = "";
}

function addMessage(msg: string) {
  const ul = roomDiv.querySelector("ul") as HTMLUListElement;
  const li = document.createElement("li");
  li.innerText = msg;
  ul.appendChild(li);
}

function showRoom(roomId: string) {
  welcomeDiv.hidden = true;
  roomDiv.hidden = false;
  const roomTitle = roomDiv.querySelector("h3") as HTMLHeadingElement;
  roomTitle.innerText = `Room ${roomId}`;
}

socket.on("joined", (user: string) => {
  addMessage(`${user} joined!`);
});

socket.on("bye", (user: string) => {
  addMessage(`${user} left!`);
});

socket.on("new_message", (newMessage: string) => {
  addMessage(newMessage);
});

// Helpers

function getElement(id: string): HTMLInputElement {
  return <HTMLInputElement>document.getElementById(id);
}
