// @ts-ignore
var socket = io();
var welcomeDiv = getElement("welcome");
var roomDiv = getElement("room");
var enterRoomForm = welcomeDiv.querySelector("#enterRoom");
var roomMessageForm = roomDiv.querySelector("#message");
var ROOM_ID;
roomDiv.hidden = true;
enterRoomForm.addEventListener("submit", handleEnterRoomSubmit);
roomMessageForm.addEventListener("submit", handleNewMessageSubmit);
function handleEnterRoomSubmit(event) {
    event.preventDefault();
    var nickname = getElement("nickname").value;
    var roomId = getElement("roomId").value;
    enterRoom(nickname, roomId);
}
function handleNewMessageSubmit(event) {
    event.preventDefault();
    var newMessage = getElement("newMessage").value;
    socket.emit("new_message", newMessage, ROOM_ID, function () {
        addMessage("You: ".concat(newMessage));
    });
    getElement("newMessage").value = "";
}
function enterRoom(nickname, roomId) {
    ROOM_ID = roomId;
    socket.emit("enter_room", nickname, roomId, function (countActive) {
        welcomeDiv.hidden = true;
        roomDiv.hidden = false;
        var roomTitle = roomDiv.querySelector("h3");
        roomTitle.innerText = "Room ".concat(ROOM_ID, " [").concat(countActive, "]");
    });
}
function addMessage(msg) {
    var ul = roomDiv.querySelector("ul");
    var li = document.createElement("li");
    li.innerText = msg;
    ul.appendChild(li);
}
// Socket listener
socket.on("welcome", function (user, countActive) {
    addMessage("".concat(user, " welcome!"));
    var roomTitle = roomDiv.querySelector("h3");
    roomTitle.innerText = "Room ".concat(ROOM_ID, " [").concat(countActive, "]");
});
socket.on("leave_room", function (user, countActive) {
    var roomTitle = roomDiv.querySelector("h3");
    roomTitle.innerText = "Room ".concat(ROOM_ID, " [").concat(countActive, "]");
    addMessage("".concat(user, " left!"));
});
socket.on("new_message", function (newMessage) {
    addMessage(newMessage);
});
socket.on("new_rooms", function (publicRooms) {
    var roomList = welcomeDiv.querySelector("ul");
    console.log(publicRooms);
    if (publicRooms.length === 0) {
        roomList.innerHTML = "";
        return;
    }
    publicRooms.forEach(function (publicRoom) {
        var room = document.createElement("li");
        room.onclick = function () { return enterRoom("anonymouse", publicRoom); };
        room.innerText = publicRoom;
        roomList.appendChild(room);
    });
});
// Helpers
function getElement(id) {
    return document.getElementById(id);
}
export {};
