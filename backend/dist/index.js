"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const UserManager_1 = require("./managers/UserManager");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
    },
});
httpServer.listen(3000, () => {
    console.log("listening on *:3000");
});
const userManager = new UserManager_1.UserManager();
let numberOfConnections = 0;
io.on("connection", (socket) => {
    numberOfConnections++;
    socket.on("join", (name) => {
        userManager.adduser(name, socket);
        console.log("name: ", name);
        console.log("user joined: ", socket.id);
        console.log("\nusers: ", userManager.getAllUsers().length);
        userManager.getAllUsers().forEach((user) => {
            console.log(user.name);
        });
    });
    socket.on("disconnect", () => {
        numberOfConnections--;
        console.log("number of connections: ", numberOfConnections);
        console.log("user disconnected ", socket.id);
        userManager.removeUser(socket.id);
        console.log("\nusers left: ", userManager.getAllUsers().length);
        userManager.getAllUsers().forEach((user) => {
            console.log(user.name);
        });
    });
});
