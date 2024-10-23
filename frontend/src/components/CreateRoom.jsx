import { useEffect, useState } from "react";
import axios from 'axios';
import { initializeSocket } from "../utils/socketIO";

export default function CreateRoom(){  
  const [userName, setUserName] = useState("")

  
  // const handleCreateRoom = async () =>{
  //   localStorage.setItem("userName", roomName)
  //   const data = { userName: localStorage.getItem("userName"), socketID: localStorage.getItem("socketID")}
  //   await axios.post("http://localhost:3001/redisData", data).then((response)=>{
  //     console.log(response)
  //   })
  // }

  // const handleUserName = (userName) => {
    
  // }
  return(
    <div>      
      <div>
      <input className="roomName" placeholder="Enter Room Name " onChange={(e)=>{setUserName(e.target.value)}}/>
      <button id="createRoomButton" onClick={localStorage.setItem("userName", userName)}>Create</button>
    </div>
    </div>
  )
}