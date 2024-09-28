const express = require('express');
const { createClient } = require('redis');
const cors = require('cors')
const { createServer } = require("http");
const { Server } = require("socket.io");
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

// const server = http.createServer(http)

app.use(cors({
    origin: 'http://localhost:3000',  // Replace with your client origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // If you are using cookies or authentication headers
}));

io.on("connection", ()=>{
    console.log("connection established")
})

const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_ENDPOINT,
        port: process.env.REDIS_PORT
    }
})

client.on('error', err => console.log('Redis Client Error', err));

async function connectRedis(){
    try{
        await client.connect();
        console.log('Connected to Redis!');
        await client.set('owner', 'dharshan');
        const value = await client.get('owner')
    }catch(error){
        console.log(error)
    }
}

httpServer.listen(3001, ()=>{
    connectRedis()
    console.log("connected to server");
})


