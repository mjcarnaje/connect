import { IConnEvent } from "./../types.d";
import { Socket } from "socket.io";

// @ts-expect-error
const socket = io() as Socket;

const welcome = document.getElementById("welcome") as HTMLElement;
const welcomeForm = welcome.querySelector("form") as HTMLFormElement;

welcomeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = welcomeForm.querySelector("input") as HTMLInputElement;

  socket.emit<IConnEvent>("enter_room", input.value, (msg: string) => {
    console.log(msg);
  });

  input.value = "";
});
