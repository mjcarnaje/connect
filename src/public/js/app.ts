const messageList = document.getElementById("messageList")!;
const messageForm = document.getElementById("messageForm")!;
const nickNameForm = document.getElementById("nickNameForm")!;

const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("Connected to Server ✔!!");
});

socket.addEventListener("message", (message) => {
  const li = document.createElement("li")!;
  li.innerText = message.data;
  li.className = "items-center p-2 rounded";

  messageList.append(li);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from Server ❌!!");
});

//**************************************************************** */

function sendMessage(type: string, payload: string): string {
  return JSON.stringify({ type, payload });
}

nickNameForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const nickNameInput = nickNameForm.querySelector("input")!;

  socket.send(sendMessage("nickname", nickNameInput.value));
});

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const messageInput = messageForm.querySelector("textarea")!;

  socket.send(sendMessage("newMessage", messageInput.value));

  messageInput.value = "";
});
