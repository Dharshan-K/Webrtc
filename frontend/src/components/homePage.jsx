import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client"
import { initializeSocket } from "../utils/socketIO";

export default function Home(){
  const navigate = useNavigate()
  const [socketID, setSocketID] = useState(null)
  const socket = initializeSocket();
  socket.on("connect", ()=>{
    console.log("connected to server")
  })
  

  useEffect(()=>{    
    
  },[])    

  const handleCreateRoom = ()=>{
    navigate("/createRoom")
  }

  const handleJoinRoom = ()=>{
    navigate("/joinRoom")
  }

  const handleSocket = ()=>{  
    

  }

  return(
    <div>
      <div>
        <button id="createRoom" onClick={handleCreateRoom}>Create Room</button>
        <button id="joinRoom" onClick={handleJoinRoom}>Join Room</button>
        <button onClick={handleSocket}>create socket</button>
        <p>{socketID}</p>
      </div>
    </div>
  )
}