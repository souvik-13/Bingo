"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomManager = void 0;
class Room {
    constructor() {
        this.roomID = Math.random().toString(36).substr(2, 9);
        this.users = [];
    }
    addUsers(users) {
        this.users = users;
        console.log("users added to room: ");
        users.forEach((user) => {
            console.log(user.name);
        });
        users[0].socket.emit("send-offer", { roomID: this.roomID });
        users[1].socket.emit("send-offer", { roomID: this.roomID });
    }
    removeUser(id) {
        const userIndex = this.users.findIndex((user) => user.id === id);
        if (userIndex !== -1) {
            this.users.splice(userIndex, 1);
        }
    }
    getUsers() {
        return this.users;
    }
}
class RoomManager {
    constructor() {
        this.rooms = [];
    }
    onOffer(roomID, sdp, senderSocketID) {
        // console.log("offer: ", roomID, sdp, senderSocketID);
        const room = this.getRoom(roomID);
        // console.log("room: ", room);
        const receiver = room === null || room === void 0 ? void 0 : room.getUsers().find((user) => user.id !== senderSocketID);
        // console.log("receiver: ", receiver?.name);
        if (receiver) {
            // console.log("receiver: ", receiver.name);
            receiver.socket.emit("offer", {
                sdp,
                roomID,
            });
            // console.log("offer sent to: ", receiver.name);
        }
    }
    onAnswer(roomID, sdp, senderSocketID) {
        // console.log("answer: ", roomID, sdp, senderSocketID);
        const room = this.getRoom(roomID);
        // console.log("room: ", room);
        const receiver = room === null || room === void 0 ? void 0 : room.getUsers().find((user) => user.id !== senderSocketID);
        // console.log("receiver: ", receiver?.name);
        if (receiver) {
            // console.log("receiver: ", receiver.name);
            receiver.socket.emit("answer", {
                sdp,
                roomID,
            });
            // console.log("answer sent to: ", receiver.name);
        }
    }
    createRoom() {
        const room = new Room();
        this.rooms.push(room);
        return room;
    }
    getRoom(roomID) {
        // console.log("rooms: ", this.rooms);
        // console.log("roomID: ", roomID)
        const room = this.rooms.find((room) => room.roomID === roomID);
        // if (!room) {
        //   console.log(`cant find room with id ${roomID}`);
        //   // throw new Error(`Room with ID ${roomID} not found`);
        // }
        return room;
    }
    deleteRoom(roomID) {
        const roomIndex = this.rooms.findIndex((room) => room.roomID === roomID);
        if (roomIndex !== -1) {
            this.rooms.splice(roomIndex, 1);
        }
    }
}
exports.RoomManager = RoomManager;
