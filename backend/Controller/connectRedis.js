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

io.on("connection", (socket)=>{
	socket.on("senderSocketID", (socketID, receiverID)=>{
		io.to(socketID).emit("getOffer", { socketID :socketID })
	})

	socket.on("sendAnswer", (offer, offerID, answerID)=>{
		io.to(offerID).emit("sendAnswer", { })
	})
})

const userData = async (req,res)=>{
  const {userName} = req.body
	console.log(userName)
  const data = await redisClient.get(userName);
	console.log(data)
  if(data){
    res.status(200).send(data)
  }else{
    res.status(400).send("User doesnt exist.")
  }  
}

const postUserData = async (req,res)=>{
	const {userName, socketID} = req.body
	await redisClient.set(userName, socketID)
	console.log(socketID)
	res.status(200).send("user updated")
}

const redisData = async (req,res)=>{
	const {userName, socketID} = req.body
	console.log(userName, socketID)
	await redisClient.set(userName, socketID)
	res.status(200).send("Stored the socket data")
}

module.exports = { redisClient, io, userData, redisData, postUserData }