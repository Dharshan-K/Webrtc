const express = require('express');
const cors = require('cors')
const { createServer } = require("http");
const { Server } = require("socket.io");
const {routes} = require("./routes");
const { config } = require('dotenv');
const {redisClient} = require("./Controller/connectRedis")
require('dotenv').config();

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer,{
  	cors: {
		origin: "http://localhost:3000",  
		methods: ["GET", "POST"], 
		credentials: true
	}
})

app.use(cors({
	origin: 'http://localhost:3000',  
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


io.on("connection", async(socket)=>{
	socket.emit("register", socket.id)

	socket.on("sendingOffer", (data)=>{
		console.log("data",data.receiverID)
		io.to(data.receiverID).emit("receivingOffer", { offer : data.offer.sdp, senderID : data.senderID })
	})

	socket.on("sendingAnswer", (data)=>{
		io.to(data.senderID).emit("receivingAnswer", { answer : data.answer })
	})
})

redisClient.on('error', err => console.log('Redis Client Error', err));
redisClient.on("connect", ()=>{
	console.log("connected to redis")
})

async function connectRedis(){
	try{
		await redisClient.connect();
	}catch(error){
		console.log(error)
	}
}

connectRedis().then(()=>{
	app.use('/', routes)  

	httpServer.listen(3001, async ()=>{
		console.log("connected to server")
	})
})

module.exports = { io }