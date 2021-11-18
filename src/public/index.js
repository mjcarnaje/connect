// @ts-expect-error
var socket = io();
var welcome = document.getElementById("welcome");
var welcomeForm = welcome.querySelector("form");
welcomeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var input = welcomeForm.querySelector("input");
    socket.emit("enter_room", input.value, function (msg) {
        console.log(msg);
    });
    input.value = "";
});
export {};
