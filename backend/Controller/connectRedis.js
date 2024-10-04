const {createClient} = require("redis");
const { Server } = require("socket.io");
require('dotenv').config();

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

module.exports = { redisClient, io }