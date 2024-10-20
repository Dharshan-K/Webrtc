import { useEffect, useState } from "react";
import axios from 'axios';
import { initializeSocket } from "../utils/socketIO";

export default function CreateRoom(){  
  const [roomName, setRoomName] = useState("")
  

  useEffect(()=>{
    const socket = initializeSocket()

    socket.on("connect", async()=>{    
      console.log("socket connected")
      console.log(socket.id)
      localStorage.setItem("socketID", socket.id)
      const data = { userName: localStorage.getItem("userName"), socketID : localStorage.getItem("socketID")}
      await axios.post("http://localhost:3001/postUserData", data).then((response)=>{
        console.log(response)
      })
    })
  },[])

  
  const handleCreateRoom = async () =>{
    localStorage.setItem("userName", roomName)
    const data = { userName: localStorage.getItem("userName"), socketID: localStorage.getItem("socketID")}
    await axios.post("http://localhost:3001/redisData", data).then((response)=>{
      console.log(response)
    })
  }
  return(
    <div>
      <input className="roomName" placeholder="Enter Room Name " onChange={(e)=>{setRoomName(e.target.value)}}/>
      <button id="createRoomButton" onClick={handleCreateRoom}>Create</button>
    </div>
  )
}