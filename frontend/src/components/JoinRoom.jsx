import { useState } from "react";
import axios from 'axios';
import { initializeSocket } from "../utils/socketIO";

export default function JoinRoom(){  
  const [roomName, setRoomName] = useState("")
  const [answer, setAnswer] = useState()
  const [iceCandidate, setIceCandidate] = useState();
  const socket = initializeSocket()

  const connection = new RTCPeerConnection();
  setAnswer(connection.createAnswer())

  const handleJoinRoom = async () =>{
    const data = {roomName: roomName, socketID: localStorage.getItem('socketId')}
    socket.emit("")
    await axios.post("http://localhost:3001/joinRoom", data).then((response)=> {
      console.log(response)
    })
  }

  return(
    <div>
      <input className="roomName" placeholder="Enter Room Name " onChange={(e)=>{setRoomName(e.target.value)}}/>
      <button id="joinRoomButton" onClick={handleJoinRoom}>Join</button>
    </div>
  )
}