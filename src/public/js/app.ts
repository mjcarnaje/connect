// @ts-ignore
const socket = io();

const welcomeEl = document.getElementById("welcome")!;
const welcomeForm = welcomeEl.querySelector("form")!;

welcomeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = welcomeForm.querySelector("input")!;
  socket.emit("enterRoom", input.value, () => {
    console.log("Entered Room!");
  });
  input.value = "";
});
