import { io } from "socket.io-client";

const socket = io();

const welcomeEl = document.getElementById("welcome") as HTMLDivElement;
const welcomeForm = welcomeEl.querySelector("form") as HTMLFormElement;

welcomeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = welcomeForm.querySelector("input") as HTMLInputElement;

  socket.emit("enterRoom", input.value, () => {
    console.log("Entered Room!");
  });

  input.value = "";
});
