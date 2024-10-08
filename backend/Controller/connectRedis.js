const {createClient} = require("redis");
const { Server } = require("socket.io");
const {createServer} = require('http');
const express = require('express')
require('dotenv').config();

const app = express()
const httpServer = createServer(app)

const redisClient = createClient({
	password: process.env.REDIS_PASSWORD,
	socket: {
		host: process.env.REDIS_ENDPOINT,
		port: process.env.REDIS_PORT
	}
})

const io = new Server(httpServer,{
	cors: {
	origin: "http://localhost:3000",  
	methods: ["GET", "POST"], 
	credentials: true
}
})

const roomData = (req,res)=>{
  const {roomName} = req.body
  const data = redisClient.get(roomName);
  if(data){
    res.status(200).send(data)
  }else{
    res.status(400).send("room doesnt exist.")
  }  
}

module.exports = { redisClient, io, roomData }