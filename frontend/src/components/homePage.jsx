import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client"

export default function Home(){
  const navigate = useNavigate()
  const [socketID, setSocketID] = useState(null)
    

  const handleCreateRoom = ()=>{
    navigate("/createRoom")
  }

  const handleSocket = ()=>{
    const socket = io("http://localhost:3001");
    socket.on('connect', () => {
      console.log('Connected to server:', socket.id);  
      setSocketID(socket.id)
      localStorage.setItem('socketId', socket.id)
    });  
    socket.on('disconnect', ()=>{
      console.log("disconnected")
    })    
  }


  return(
    <div>
      <div>
        <button id="createRoom" onClick={handleCreateRoom}>Create Room</button>
        <button id="joinRoom">Join Room</button>
        <button onClick={handleSocket}>create socket</button>
        <p>{socketID}</p>
      </div>
    </div>
  )
}