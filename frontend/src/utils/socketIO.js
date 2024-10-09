import { useState } from "react";
import { io } from "socket.io-client";
import { redisClient } from "../../../backend/Controller/connectRedis";

// socket.on('connect', () => {
  // console.log('Connected to server:', socket.id);  
  // localStorage.setItem('socketId', socket.id)
// });  
// socket.on('disconnect', ()=>{
//   console.log("disconnected")
// })    

export function initializeSocket(){
  const socket = io("http://localhost:3001");
  return socket;
}

