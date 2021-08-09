var socket = new WebSocket("ws://" + window.location.host);
socket.addEventListener("open", function () {
    console.log("Connected to Server ✔!!");
});
socket.addEventListener("message", function (message) {
    console.log("New message: ", message.data);
});
socket.addEventListener("close", function () {
    console.log("Disconnected from Server ❌!!");
});
setTimeout(function () {
    socket.send("Hello from the Browser! ❤");
}, 5000);
