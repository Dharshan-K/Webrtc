import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import './../App.css';
import { io } from "socket.io-client";

const pc_config = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

export default function JoinRoom() {
  const [user, setUser] = useState();
  const [userName, setUserName] = useState();
  const [callerName, setCallerName] = useState();
  
  const connectionRef = useRef();
  const socketRef = useRef();
  const localStreamRef = useRef();

  useEffect(() => {
    console.log("useEffect ran")
    connectionRef.current = new RTCPeerConnection(pc_config);
    
    socketRef.current = io("https://webrtc-backend-rhcw.onrender.com", {
      query: { userName: localStorage.getItem("userName") }
    });

    const initMedia = async () => {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        
        localStreamRef.current = localStream;
        
        localStream.getTracks().forEach(track => {
          connectionRef.current.addTrack(track, localStream);
        });
        
        const user1Video = document.getElementById("user1");
        if (user1Video) {
          user1Video.srcObject = localStream;
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };

    initMedia();
    connectionRef.current.ontrack = (event) => {
      console.log("Received remote track", event);
      const user2Video = document.getElementById("user2");
      if (user2Video && event.streams[0]) {
        user2Video.srcObject = event.streams[0];
      }
    };

    connectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("sending candidate", localStorage.getItem("receiverID"));
        socketRef.current.emit("sendingIceCandidate", {
          candidate: event.candidate,
          senderID: localStorage.getItem("receiverID")
        });
      }
    };

    socketRef.current.on("register", (id) => {
      setUser(id);
      console.log("socket", socketRef.current.id)
      localStorage.setItem("socketID", id);
    });

    socketRef.current.on("receivingOffer", async (data) => {
      try {
        const remoteDescription = new RTCSessionDescription({
          type: "offer",
          sdp: data.offer
        });
        
        await connectionRef.current.setRemoteDescription(remoteDescription);
        const answer = await connectionRef.current.createAnswer();
        await connectionRef.current.setLocalDescription(answer);
        
        socketRef.current.emit("sendingAnswer", {
          answer: answer,
          senderID: data.senderID
        });
      } catch (err) {
        console.error("Error handling offer:", err);
      }
    });

    socketRef.current.on("receivingAnswer", async (data) => {
      try {
        if (connectionRef.current.signalingState !== "have-local-offer") {
          console.warn("Unexpected signaling state for setting remote answer");
          return;
        }
        
        const remoteDescription = new RTCSessionDescription({
          type: "answer",
          sdp: data.answer.sdp
        });
        
        await connectionRef.current.setRemoteDescription(remoteDescription);
      } catch (err) {
        console.error("Error handling answer:", err);
      }
    });

    socketRef.current.on("iceCandidate", async (data) => {
      try {
        const candidate = new RTCIceCandidate(data.candidate);
        await connectionRef.current.addIceCandidate(candidate);
        console.log("received ICE candidate");
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    });

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (connectionRef.current) {
        connectionRef.current.close();
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const initiateCall = async () => {
    try {
      const receiverID = await getCallerData();
      const offer = await connectionRef.current.createOffer();
      await connectionRef.current.setLocalDescription(offer);
      
      socketRef.current.emit("sendingOffer", {
        offer: offer,
        senderID: user,
        receiverID: receiverID
      });
    } catch (err) {
      console.error("Error initiating call:", err);
    }
  };

  const createUser = async () => {
    try {
      const data = { userName: userName, senderID: user };
      const response = await axios.post("https://webrtc-backend-rhcw.onrender.com/postUserData", data);
      console.log("response", response);
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  const getCallerData = async () => {
    try {
      const data = { userName: callerName };
      const response = await axios.post("https://webrtc-backend-rhcw.onrender.com/userData", data);
      const id = response.data;
      localStorage.setItem("receiverID", id);
      return id;
    } catch (err) {
      console.error("Error getting caller data:", err);
      return null;
    }
  };

  return (
    <div>
      <div>
        <input
          className="roomName"
          placeholder="Enter User Name "
          onChange={(e) => setCallerName(e.target.value)}
        />
        <button id="joinUserButton" onClick={initiateCall}>Request</button>
        <div>
          <input
            className="roomName"
            placeholder="Create User "
            onChange={(e) => setUserName(e.target.value)}
          />
          <button id="joinUserButton" onClick={createUser}>Create</button>
        </div>
        <br />
      </div>

      <div id="videos">
        <video className="video-player" id="user1" autoPlay playsInline></video>
        <video className="video-player" id="user2" autoPlay playsInline></video>
      </div>
    </div>
  );
}
