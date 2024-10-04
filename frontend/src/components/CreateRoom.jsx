import { useState } from "react";
import axios from 'axios';

export default function CreateRoom(){  
  const [roomName, setRoomName] = useState("")
  const handleCreateRoom = async () =>{
    const data = {roomName: roomName, socketID: localStorage.getItem('socketId')}
    console.log(data)
    await axios.post("http://localhost:3001/createRoom", data).then((response)=> {
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