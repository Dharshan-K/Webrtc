import { useState } from "react";
import { io } from "socket.io-client";

// socket.on('connect', () => {
  // console.log('Connected to server:', socket.id);  
  // localStorage.setItem('socketId', socket.id)
// });  
// socket.on('disconnect', ()=>{
//   console.log("disconnected")
// })    

export function initializeSocket(){
  const socket = io("https://webrtc-backend-rhcw.onrender.com", {
    query : { userName : localStorage.getItem("userName")}
  });
  return socket;
}

