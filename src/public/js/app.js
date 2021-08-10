var messageList = document.getElementById("messageList");
var messageForm = document.getElementById("messageForm");
var nickNameForm = document.getElementById("nickNameForm");
var socket = new WebSocket("ws://" + window.location.host);
socket.addEventListener("open", function () {
    console.log("Connected to Server ✔!!");
});
socket.addEventListener("message", function (message) {
    var li = document.createElement("li");
    li.innerText = message.data;
    li.className = "items-center p-2 rounded";
    messageList.append(li);
});
socket.addEventListener("close", function () {
    console.log("Disconnected from Server ❌!!");
});
//**************************************************************** */
function sendMessage(type, payload) {
    return JSON.stringify({ type: type, payload: payload });
}
nickNameForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var nickNameInput = nickNameForm.querySelector("input");
    socket.send(sendMessage("nickname", nickNameInput.value));
});
messageForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var messageInput = messageForm.querySelector("textarea");
    socket.send(sendMessage("newMessage", messageInput.value));
    messageInput.value = "";
});
