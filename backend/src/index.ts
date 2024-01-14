import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { UserManager, User } from "./managers/UserManager";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
httpServer.listen(3000, () => {
  console.log("listening on *:3000");
});

const userManager = new UserManager();

let numberOfConnections = 0;



io.on("connection", (socket: Socket) => {
  numberOfConnections++;

  socket.on("join", (name: string) => {
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
