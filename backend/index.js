const express = require('express');
const { createClient } = require('redis');
const cors = require('cors')
const { createServer } = require("http");
const { Server } = require("socket.io");
const {routes} = require("./routes")
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
    origin: 'http://localhost:3000',  
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


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

app.use('/', routes)

httpServer.listen(3002, ()=>{
    connectRedis()
    console.log("connected to server");
})

module.exports = client;
