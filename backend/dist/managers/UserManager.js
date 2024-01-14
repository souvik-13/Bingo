"use strict";
/**
 * This class is responsible for managing the users coming to the server.
 * It will handle the creation of users and removing them.
 *
 * Each user will have a unique id, which will be used to identify them.
 *
 * Each user will have three states:
 * - connected  (When the user is connected to another user)
 * - waiting    (When the user is waiting for another user to connect to)
 * - normal    (When the user just connected to the server and is not connected to anyone and is not waiting for anyone)
 *
 * ? How to store the users?
 * => When a user connects to the server it will be added to the users array, and will be in the normal state.
 *
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
const RoomManager_1 = require("./RoomManager");
class UserManager {
    constructor() {
        this.users = [];
        this.queues = Array(10)
            .fill(null)
            .map(() => []);
        this.maxQueueSize = 50;
        this.maxNumberOfQueues = 10;
        this.RoomManager = new RoomManager_1.RoomManager();
        setInterval(() => {
            this.clearQueues();
            // this.users.forEach((user) => this.initHandler(user.socket));
        }, 1000);
    }
    printQueues() {
        console.log("\n\n");
        console.log("queues: ");
        this.queues.forEach((queue, index) => {
            console.log("queue: ", index);
            queue.forEach((user) => {
                console.log(user.name);
            });
        });
        console.log("\n\n");
    }
    isQueueEmpty() {
        let n = 0;
        for (let i = 0; i < this.queues.length; i++) {
            n += this.queues[i].length;
        }
        if (n >= 2)
            return false;
        else
            return true;
    }
    pushToQueues(user) {
        /**
         * This function will push the user to the queues.
         * It will push the user to the queue with the least amount of users.
         * If all the queues are full, it will create a new queue and push the user to it.
         * If all the queues are full and the maxQueueSize is reached, it will return an error.
         */
        // check if the user is already in the queue
        if (user.queueIndex !== undefined) {
            this.queues[user.queueIndex] = this.queues[user.queueIndex].filter((user) => user.name !== user.name);
        }
        let minQueueIndex = 0;
        let minQueueLength = this.queues[0].length;
        for (let i = 1; i < this.queues.length; i++) {
            if (this.queues[i].length < minQueueLength) {
                minQueueLength = this.queues[i].length;
                minQueueIndex = i;
            }
        }
        if (minQueueLength < this.maxQueueSize) {
            this.queues[minQueueIndex].push(user);
            console.log("pushed user: ", user.name, " to queue: ", minQueueIndex);
            user.queueIndex = minQueueIndex;
        }
        else if (this.queues.length < this.maxNumberOfQueues) {
            this.queues.push([user]);
            user.queueIndex = this.queues.length - 1;
        }
        else {
            throw new Error("Maximum number of users reached");
        }
    }
    connectUsers(user1, user2) {
        /**
         * This function will connect two users.
         * It will set the state of both the users to connected.
         * It will set the connectedTo of both the users to the id of the other user.
         */
        const room = this.RoomManager.createRoom();
        user1.queueIndex = undefined;
        user2.queueIndex = undefined;
        room.addUsers([user1, user2]);
    }
    initHandler(socket) {
        if (!hasListeners(socket, "offer")) {
            socket.on("offer", ({ sdp, roomID }) => {
                console.log("offer: ", roomID, sdp, socket.id, "at line 123");
                this.RoomManager.onOffer(roomID, sdp, socket.id);
            });
        }
        if (!hasListeners(socket, "answer")) {
            socket.on("answer", ({ sdp, roomID }) => {
                this.RoomManager.onAnswer(roomID, sdp, socket.id);
            });
        }
    }
    getTwoUsersFromQueues() {
        /**
         * We will pop two users from the two queues with maximum number of users.
         * If there are no users in any of the queues, we will return a message saying that there are no users.
         */
        // console.log("getTwoUsersFromQueues")
        let maxQueueIndex1 = 0;
        let maxQueueLength1 = this.queues[0].length;
        let maxQueueIndex2 = 1;
        let maxQueueLength2 = this.queues[1].length;
        for (let i = 1; i < this.queues.length; i++) {
            if (this.queues[i].length > maxQueueLength1) {
                maxQueueLength2 = maxQueueLength1;
                maxQueueIndex2 = maxQueueIndex1;
                maxQueueLength1 = this.queues[i].length;
                maxQueueIndex1 = i;
            }
            else if (this.queues[i].length > maxQueueLength2) {
                maxQueueLength2 = this.queues[i].length;
                maxQueueIndex2 = i;
            }
        }
        if (maxQueueLength1 === 0 || maxQueueLength2 === 0) {
            return null;
        }
        const user1 = this.queues[maxQueueIndex1].pop();
        const user2 = this.queues[maxQueueIndex2].pop();
        if (user1 && user2) {
            console.log("poped users: ", user1.name, user2.name);
            return [user1, user2];
        }
        else {
            throw new Error("Something went wrong");
        }
    }
    clearQueues() {
        /**
         * This function will clear the queues.
         * It will remove all the users from the queues.
         */
        while (!this.isQueueEmpty()) {
            console.log("clearing queues");
            const users = this.getTwoUsersFromQueues();
            if (users) {
                try {
                    this.connectUsers(users[0], users[1]);
                }
                catch (error) {
                    // push the users back to the queues
                    this.pushToQueues(users[0]);
                    this.pushToQueues(users[1]);
                    console.log(error);
                }
            }
        }
        // this.clearQueues();
    }
    removeUserFromQueues(id, queueIndex) {
        this.queues[queueIndex] = this.queues[queueIndex].filter((user) => user.id !== id);
    }
    adduser(name, socket) {
        const user = {
            id: socket.id,
            name: name,
            state: "waiting",
            connectedTo: "",
            socket: socket,
        };
        // check if the user is already in the users array
        const userIndex = this.users.findIndex((user) => user.id === socket.id);
        if (userIndex !== -1) {
            this.users[userIndex] = user;
        }
        else {
            this.users.push(user);
        }
        this.initHandler(socket);
        this.pushToQueues(user);
        // setInterval(() => {
        //   this.clearQueues();
        //   this.initHandler(socket);
        // }, 1000);
        // this.printQueues();
    }
    removeUser(id, queueIndex) {
        this.users = this.users.filter((user) => user.id !== id);
        if (queueIndex) {
            this.removeUserFromQueues(id, queueIndex);
        }
    }
    getUser(id) {
        return this.users.find((user) => user.id === id);
    }
    getAllUsers() {
        return this.users;
    }
}
exports.UserManager = UserManager;
function hasListeners(socket, eventName) {
    return socket.listeners(eventName).length > 0;
}
