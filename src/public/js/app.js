// @ts-ignore
var socket = io();
var welcomeEl = document.getElementById("welcome");
var welcomeForm = welcomeEl.querySelector("form");
welcomeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var input = welcomeForm.querySelector("input");
    socket.emit("enterRoom", input.value, function () {
        console.log("Entered Room!");
    });
    input.value = "";
});
