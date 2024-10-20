import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import './../App.css';
import { initializeSocket } from "../utils/socketIO";

export default function JoinRoom(){ 
  const [userName, setUsername] = useState()
  const [receiverID, setReceiverID] = useState()
  const [roomName, setRoomName] = useState("")
  const socket = useRef()
  const connection = useRef()
  socket.current = initializeSocket()
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
    connection.current = new RTCPeerConnection(configuration)
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
    socket.current.on("connect", async()=>{    
      console.log("socket connected")
      console.log(socket.current.id)
      localStorage.setItem("socketID", socket.current.id)
    })    

    connection.current.onicecandidate = async(event)=>{
      if(event.candidate){
        try{
          const data = { userName : userName }
          await axios.post("http://localhost:3001/userData", data).then((response)=>{
            socket.current.emit("iceCandidate", { senderID : response.data, iceCandidate : event.candidate})
          })
          console.log("ice candidate sent") 
        } catch(err){
          console.log(err)
        }   
      }
    }
  
    connection.current.ontrack = (event)=>{
      const remoteStream = event.streams[0]
      document.getElementById("user2").srcObject = remoteStream;
    }
  }, [])

  

  socket.current.on("sendAnswertoSender", async(data)=>{
    console.log("got the offer")    
    const sdp = data.offer.sdp 
    const remoteDescription = new RTCSessionDescription({
      type: "offer",
      sdp: sdp
    })
    connection.current.setRemoteDescription(remoteDescription)
    const answer = await connection.createAnswer()
    connection.current.setLocalDescription(answer);
    socket.current.emit("sendingAnswer", { answer : answer, senderID : data.senderID })
  })

  socket.current.on("sendingAnswertoReceiver", async(data)=>{
    console.log("got the answer", data.answer.sdp)
    const remoteDescription = new RTCSessionDescription({
      type: "answer",
      sdp: data.answer.sdp
    })
    connection.current.setRemoteDescription(remoteDescription)
  })

  socket.current.on("receiveIceCandidate", async (data)=>{
    try{
      await connection.current.addIceCandidate(new RTCIceCandidate(data.iceCandidate))
    } catch(err){
      console.log(err)
    }
  })

  const handleUserRoom = ()=>{
    getSocketID()
  } 

  const getSocketID = async()=>{
    const data = { userName: userName}
    var id;
    console.log("getSocketID")
    await axios.post("http://localhost:3001/userData", data).then((response)=>{
      setReceiverID(response.data)      
      id = response.data
    })  
    const offer = await connection.current.createOffer();
    connection.current.setLocalDescription(offer);
    socket.current.emit("sendAnswer", { offer : offer, offerID : socket.current.id, answerID : id })  
  }

  const getID = ()=>{
    console.log("socketID", socket.current.id)
  }

  const handleCreateRoom = async () =>{
    localStorage.setItem("userName", roomName)
    const data = { userName: localStorage.getItem("userName"), socketID: localStorage.getItem("socketID")}
    await axios.post("http://localhost:3001/postUserData", data).then((response)=>{
      console.log(response.data)
    })
  }
  

  return(
    <div>
      <input className="roomName" placeholder="Enter User Name " onChange={(e)=>{setUsername(e.target.value)}}/>
      <button id="joinUserButton" onClick={handleUserRoom}>Request</button>
      <button id="button" onClick={getID}>onClick</button>
      <br></br>
      <div>
      <input className="roomName" placeholder="Enter Room Name " onChange={(e)=>{setRoomName(e.target.value)}}/>
      <button id="createRoomButton" onClick={handleCreateRoom}>Create</button>
    </div>
    <div id="videos">
			<video className="video-player" id="user1" autoPlay playsInline></video>
			<video className="video-player" id="user2" autoPlay playsInline></video>
		</div>
    </div>
  )
}