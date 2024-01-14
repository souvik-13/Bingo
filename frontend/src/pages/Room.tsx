import { Socket, io } from "socket.io-client";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

const URL = "http://localhost:3000";
// let numberOfConnections = 0;

const Room = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [name, setName] = useState(searchParams.get("name") || "");
  // const [stranger, setStranger] = useState(null);
  const [roomID, setRoomID] = useState(null);

  useEffect(() => {}, [messages]);
  useEffect(() => {}, [loading]);
  useEffect(() => {
    console.log("connecting to roomID", roomID);
  }, [roomID]);
  // useEffect(() => {
  //   console.log("connecting to stranger", stranger);
  // }, [stranger]);
  useEffect(() => {
    socket?.emit("join", { name });

    socket?.on("disconnect", () => {
      console.log("disconnected");
      // setLoading(true);
    });

    socket?.on("send-offer", (roomID) => {
      // alert("send-offer");
      console.log("send-offer", roomID);

      // setStranger(roomID.username);

      setRoomID(roomID);
      // setLoading(false);
      // console.log("emming offer", roomID, "sdp");
      socket?.emit("offer", { roomID: roomID.roomID, sdp: "sdp" });
      console.log("emming offer", roomID, "sdp");
    });

    socket?.on("offer", (roomID) => {
      // alert("send answer");
      // console.log("emming answer", roomID, "sdp");
      socket?.emit("answer", { roomID: roomID.roomID, sdp: "sdp" });
      console.log("emming answer", roomID, "sdp");
    });
    socket?.on("answer", () => {
      alert("connection is done");
      // socket?.emit("send-answer", { roomID, sdp: "answer" });
    });

    console.log("name", name);
  }, [socket, name]);
  useEffect(() => {
    const newSocket = io(URL, {
      autoConnect: true,
    });
    // numberOfConnections++;
    setSocket(newSocket);
    // setLoading(false);

    // console.log("numberOfConnections", numberOfConnections);
    // return () => newSocket.close();
  }, [name]);

  return (
    <div className="flex  flex-col  items-center justify-center">
      <button
        onClick={() => {
          // socket?.emit("disconnect", { roomID });
          window.location.href = `/join`;
        }}
      >
        Exit
      </button>
      <h1>Welcome to the room {name}</h1>
      <h1>Room ID: {roomID ? roomID.roomID : ""}</h1>
      {/* <h1>Stranger: {stranger? stranger : "null"}</h1> */}
      {/* <h1>answer: {answer}</h1> */}
      <video width={500} height={500}></video>
      <video width={500} height={500}></video>
    </div>
  );
};

export default Room;
