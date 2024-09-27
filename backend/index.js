const express = require('express');
const { createClient } = require('redis');
require('dotenv').config();
const app = express()
// const server = http.createServer(http)

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

app.listen(3001, ()=>{
    connectRedis()
    console.log("connected to server");
})


