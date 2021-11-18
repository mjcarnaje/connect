import { IConnEvent } from "./../types.d";
import { Socket } from "socket.io";

// @ts-expect-error
const socket = io() as Socket;

const welcome = document.getElementById("welcome") as HTMLElement;
const welcomeForm = welcome.querySelector("form") as HTMLFormElement;
const room = document.getElementById("room") as HTMLElement;
const roomForm = room.querySelector("form") as HTMLFormElement;

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

  socket.emit<IConnEvent>("enter_room", roomName, () => {
    showRoom(roomName);
  });

  input.value = "";
});

roomForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = roomForm.querySelector("input") as HTMLInputElement;
  const newMessage = input.value;

  socket.emit<IConnEvent>("new_message", newMessage, roomName, () => {
    addMessage(`You: ${newMessage}`);
  });

  input.value = "";
});

socket.on<IConnEvent>("joined", () => {
  addMessage("someone joined!");
});

socket.on<IConnEvent>("bye", () => {
  addMessage("someone left!");
});

socket.on<IConnEvent>("new_message", (newMessage: string) => {
  addMessage(newMessage);
});
