import { useEffect, useState } from "react";
import axios from 'axios';
import './../App.css';
import { initializeSocket } from "../utils/socketIO";

export default function JoinRoom(){ 
  const [userName, setUsername] = useState()
  const [receiverID, setReceiverID] = useState()
  const socket = initializeSocket()
  let configuration = {
		iceServers: [
			{ urls: 'stun:stun.l.google.com:19302' },
			{ urls: 'stun:stun1.l.google.com:19302' },
			{ urls: 'stun:stun2.l.google.com:19302' },
			{ urls: 'stun:stun3.l.google.com:19302' },
			{ urls: 'stun:stun4.l.google.com:19302' }
		]	
	}

  useEffect(()=>{
    const initMedia = async()=>{
      let localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });		
    
      localStream.getTracks().forEach(track => {
        connection.addTrack(track, localStream)
      })
      document.getElementById("user1").srcObject = localStream;
    }

    initMedia()
  }, [])
  const connection = new RTCPeerConnection(configuration)
  

  socket.on("getOffer", async (socketID)=>{
    console.log("socket ID of user1: ", socketID)
    
    const offer = await connection.createOffer();
    connection.setLocalDescription(offer);
    socket.emit("sendAnswer", { offer : offer, offerID : localStorage.getItem("socketID"), answerID : socketID })
  })

  const handleUserRoom = ()=>{
    getSocketID()
    socket.emit("sendOffer", {senderID : localStorage.getItem("socketID"), receiverID : receiverID})
  } 

  const getSocketID = async()=>{
    const data = { userName: userName}
    await axios.post("http://localhost:3001/userData", data).then((response)=>{
      console.log("response",response.data)
      setReceiverID(response.data)
    })    
  }
  

  return(
    <div>
      <input className="roomName" placeholder="Enter User Name " onChange={(e)=>{setUsername(e.target.value)}}/>
      <button id="joinUserButton" onClick={handleUserRoom}>Request</button>
      <br></br>
    <div id="videos">
			<video className="video-player" id="user1" autoPlay playsInline></video>
			<video className="video-player" id="user2" autoPlay playsInline></video>
		</div>
    </div>
  )
}