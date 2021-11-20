// @ts-ignore
var socket = io();
var welcomeDiv = getElement("welcome");
var roomDiv = getElement("room");
var enterRoomForm = welcomeDiv.querySelector("#enterRoom");
var roomMessageForm = roomDiv.querySelector("#message");
var roomId;
roomDiv.hidden = true;
enterRoomForm.addEventListener("submit", handleEnterRoomSubmit);
roomMessageForm.addEventListener("submit", handleNewMessageSubmit);
function handleEnterRoomSubmit(event) {
    event.preventDefault();
    var nickname = getElement("nickname").value;
    var _roomId = getElement("roomId").value;
    roomId = _roomId;
    socket.emit("enter_room", nickname, _roomId, function () {
        showRoom(roomId);
    });
}
function handleNewMessageSubmit(event) {
    event.preventDefault();
    var newMessage = getElement("newMessage").value;
    socket.emit("new_message", newMessage, roomId, function () {
        addMessage("You: ".concat(newMessage));
    });
    getElement("newMessage").value = "";
}
function addMessage(msg) {
    var ul = roomDiv.querySelector("ul");
    var li = document.createElement("li");
    li.innerText = msg;
    ul.appendChild(li);
}
function showRoom(roomId) {
    welcomeDiv.hidden = true;
    roomDiv.hidden = false;
    var roomTitle = roomDiv.querySelector("h3");
    roomTitle.innerText = "Room ".concat(roomId);
}
socket.on("joined", function (user) {
    addMessage("".concat(user, " joined!"));
});
socket.on("bye", function (user) {
    addMessage("".concat(user, " left!"));
});
socket.on("new_message", function (newMessage) {
    addMessage(newMessage);
});
socket.on("new_rooms", function (publicRooms) {
    var roomList = welcomeDiv.querySelector("ul");
    roomList.innerHTML = "";
    if (publicRooms.length === 0) {
        roomList.innerHTML = "";
        return;
    }
    publicRooms.forEach(function (publicRoom) {
        var room = document.createElement("li");
        room.innerText = publicRoom;
        roomList.appendChild(room);
    });
});
// Helpers
function getElement(id) {
    return document.getElementById(id);
}
export {};
