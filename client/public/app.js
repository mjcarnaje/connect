"use strict";
exports.__esModule = true;
var socket_io_client_1 = require("socket.io-client");
var socket = socket_io_client_1.io();
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
