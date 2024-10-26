import { useEffect, useRef, useState, createContext } from "react";
import axios from 'axios';
import './../App.css';
import { io } from "socket.io-client";


const socket = io("http://localhost:3001", {
    query : { userName : localStorage.getItem("userName")}
});

// const connection = new RTCPeerConnection()
export default function JoinRoom2(){ 
  const [user, setUser] = useState() 
  const [userName, setUserName] = useState()
  const [CallerName, setCallerName] = useState()
  const connection = useRef()
  const currentSocket = useRef()
  const localStreamRef = useRef()
  const pc_config = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302",
        },
    ],
  };  

  useEffect(()=>{
    connection.current = new RTCPeerConnection(pc_config)
    const initMedia = async()=>{      
      let localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });    
      localStreamRef.current = localStream
      localStream.getTracks().forEach(track => {
        connection.current.addTrack(track, localStream)
      })
      document.getElementById("user1").srcObject = localStream;
    }

    initMedia()
    currentSocket.current = socket

    connection.current.ontrack = (event) => {
      console.log("Received remote track", event);
      document.getElementById("user2").srcObject = event.streams[0];
    };

    connection.current.onicecandidate = (event)=>{
      if(event.candidate){
        console.log("sending candidate", localStorage.getItem("receiverID"))
        socket.emit("sendingIceCandidate", { candidate : event.candidate, senderID : localStorage.getItem("receiverID")})
      }
    } 

    socket.on("register", (id)=>{
      setUser(id)
      console.log("connection", connection)
      console.log("state", connection.current.signalingState)
      localStorage.setItem("socketID", id);
    })

    connection.current.onicecandidate = (event)=>{
      if(event.candidate){
        console.log("sending candidate", localStorage.getItem("receiverID"))
        socket.emit("sendingIceCandidate", { candidate : event.candidate, senderID : localStorage.getItem("receiverID")})
      }
    }

    socket.on("receivingOffer", async(data)=>{
      const remoteDescription = new RTCSessionDescription({
        type: "offer",
        sdp: data.offer
      })
      await connection.current.setRemoteDescription(remoteDescription).then(async()=>{
        const answer = await connection.current.createAnswer()
        await connection.current.setLocalDescription(answer)    
        socket.emit("sendingAnswer", { answer : answer, senderID : data.senderID })      
      })    
    })

    socket.on("receivingAnswer", async(data)=>{  
      const remoteDescription = new RTCSessionDescription({
        type: "answer",
        sdp: data.answer.sdp
      })  
      await connection.current.setRemoteDescription(remoteDescription)                
  })

    // socket.on("iceCandidate", async (data)=>{
    //   try{
    //     const Candidate = new RTCIceCandidate(data.candidate)
    //     await connection.current.addIceCandidate(Candidate)
    //     console.log("received ICecandidate")
    //   }catch(err){
    //     console.log(err)
    //   }
    // })

    return()=>{
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (connection.current) {
        connection.current.close();
      }
      if (socket) {
        socket.disconnect();
      }
    }
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
    localStorage.setItem("receiverID", id)
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