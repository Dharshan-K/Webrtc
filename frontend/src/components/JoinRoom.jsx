import { useEffect, useRef, useState, createContext } from "react";
import axios from 'axios';
import './../App.css';
import { initializeSocket } from "../utils/socketIO";
import CreateRoom from "./CreateRoom";
import { io } from "socket.io-client";


const socket = io("http://localhost:3001", {
    query : { userName : localStorage.getItem("userName")}
});
export default function JoinRoom(){ 
  const [user, setUser] = useState() 
  const [userName, setUserName] = useState()
  const [CallerName, setCallerName] = useState()
  const connection = useRef()
  const currentSocket = useRef()
  connection.current = new RTCPeerConnection()

  useEffect(()=>{
    const initMedia = async()=>{      
      let localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });    
      localStream.getTracks().forEach(track => {
        connection.current.addTrack(track, localStream)
      })
      document.getElementById("user1").srcObject = localStream;
    }

    initMedia()
    currentSocket.current = socket

    socket.on("register", (id)=>{
      setUser(id)
      console.log("socket registerd", socket.id)
      localStorage.setItem("socketID", id);
    })

    socket.on("receivingOffer", async(data)=>{
      const remoteDescription = new RTCSessionDescription({
        type: "offer",
        sdp: data.offer
      })  
      await connection.current.setRemoteDescription(remoteDescription)  
      const answer = await connection.current.createAnswer()
      await connection.current.setLocalDescription(answer)
      console.log("sending Answer")    
      socket.emit("sendingAnswer", { answer : answer, senderID : data.senderID })
    })

    socket.on("receivingAnswer", async(data)=>{
      console.log("answer received")
      const remoteDescription = new RTCSessionDescription({
        type: "answer",
        sdp: data.offer.sdp
      })  
      await connection.current.setRemoteDescription(remoteDescription)
      console.log("answer Set")
    })
  },[])

  


  const initiateCall = async ()=>{
    const receiverID = await getCallerData()
    const offer = await connection.current.createOffer()
    connection.current.setLocalDescription(offer)
    socket.emit("sendingOffer", { offer : offer, senderID : user, receiverID : receiverID})
  }

  const createUser = async()=>{
    const data = { userName : userName, senderID : user }
    await axios.post("http://localhost:3001/postUserData", data).then((response)=>{
      console.log("response", response)
    })
  }

  const getCallerData = async()=>{
    const data = { userName : CallerName}
    let id;
    await axios.post("http://localhost:3001/userData", data).then((response)=>{
      id = response.data
    })
    return id
  }

  return(
    <div>
    <div>
      <input className="roomName" placeholder="Enter User Name " onChange={(e)=>{setCallerName(e.target.value)}}/>
      <button id="joinUserButton" onClick={()=>{initiateCall()}}>Request</button>
      <button id="button" >onClick</button>
      <div>
      <input className="roomName" placeholder="Create User " onChange={(e)=>{setUserName(e.target.value)}}/>
      <button id="joinUserButton" onClick={()=>{createUser()}}>Create</button>
      </div>
      <br></br>
    </div>

    <div id="videos">
			<video className="video-player" id="user1" autoPlay playsInline></video>
			<video className="video-player" id="user2" autoPlay playsInline></video>
		</div>
    </div>
  )
}