import { Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "../types";

type ISocketClient = Socket<ServerToClientEvents, ClientToServerEvents>;

// @ts-ignore
const socket: ISocketClient = io();

const welcomeDiv = getElement("welcome");
const roomDiv = getElement("room");

const enterRoomForm = <HTMLFormElement>welcomeDiv.querySelector("#enterRoom");
const roomMessageForm = <HTMLFormElement>roomDiv.querySelector("#message");

let ROOM_ID: string;
roomDiv.hidden = true;

enterRoomForm.addEventListener("submit", handleEnterRoomSubmit);
roomMessageForm.addEventListener("submit", handleNewMessageSubmit);

function handleEnterRoomSubmit(event: Event) {
  event.preventDefault();

  const nickname = getElement("nickname").value;
  const roomId = getElement("roomId").value;

  enterRoom(nickname, roomId);
}

function handleNewMessageSubmit(event: Event) {
  event.preventDefault();

  const newMessage = getElement("newMessage").value;

  socket.emit("new_message", newMessage, ROOM_ID, () => {
    addMessage(`You: ${newMessage}`);
  });

  getElement("newMessage").value = "";
}

function enterRoom(nickname: string, roomId: string) {
  ROOM_ID = roomId;

  socket.emit("enter_room", nickname, roomId, (countActive) => {
    welcomeDiv.hidden = true;
    roomDiv.hidden = false;
    const roomTitle = <HTMLHeadingElement>roomDiv.querySelector("h3");
    roomTitle.innerText = `Room ${ROOM_ID} [${countActive}]`;
  });
}

function addMessage(msg: string) {
  const ul = <HTMLUListElement>roomDiv.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = msg;
  ul.appendChild(li);
}

// Socket listener

socket.on("welcome", (user, countActive) => {
  addMessage(`${user} welcome!`);
  const roomTitle = <HTMLHeadingElement>roomDiv.querySelector("h3");
  roomTitle.innerText = `Room ${ROOM_ID} [${countActive}]`;
});

socket.on("leave_room", (user, countActive) => {
  const roomTitle = <HTMLHeadingElement>roomDiv.querySelector("h3");
  roomTitle.innerText = `Room ${ROOM_ID} [${countActive}]`;
  addMessage(`${user} left!`);
});

socket.on("new_message", (newMessage) => {
  addMessage(newMessage);
});

socket.on("new_rooms", (publicRooms) => {
  const roomList = <HTMLUListElement>welcomeDiv.querySelector("ul");

  console.log(publicRooms);

  if (publicRooms.length === 0) {
    roomList.innerHTML = "";
    return;
  }

  publicRooms.forEach((publicRoom) => {
    const room = document.createElement("li");
    room.onclick = () => enterRoom("anonymouse", publicRoom);
    room.innerText = publicRoom;
    roomList.appendChild(room);
  });
});

// Helpers

function getElement(id: string): HTMLInputElement {
  return <HTMLInputElement>document.getElementById(id);
}
