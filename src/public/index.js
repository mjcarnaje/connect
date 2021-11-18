// @ts-expect-error
var socket = io();
var welcome = document.getElementById("welcome");
var welcomeForm = welcome.querySelector("form");
var room = document.getElementById("room");
var roomForm = room.querySelector("form");
room.hidden = true;
var roomName;
function addMessage(msg) {
    var ul = room.querySelector("ul");
    var li = document.createElement("li");
    li.innerText = msg;
    ul.appendChild(li);
}
function showRoom(roomName) {
    welcome.hidden = true;
    room.hidden = false;
    var roomTitle = room.querySelector("h3");
    roomTitle.innerText = "Room ".concat(roomName);
}
welcomeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var input = welcomeForm.querySelector("input");
    roomName = input.value;
    socket.emit("enter_room", roomName, function () {
        showRoom(roomName);
    });
    input.value = "";
});
roomForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var input = roomForm.querySelector("input");
    var newMessage = input.value;
    socket.emit("new_message", newMessage, roomName, function () {
        addMessage("You: ".concat(newMessage));
    });
    input.value = "";
});
socket.on("joined", function () {
    addMessage("someone joined!");
});
socket.on("bye", function () {
    addMessage("someone left!");
});
socket.on("new_message", function (newMessage) {
    addMessage(newMessage);
});
export {};
