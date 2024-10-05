const {redisClient, io}  = require("./connectRedis")
const { v4 :uuidv4} = require('uuid')

const createRoom = async (req,res)=>{
  try{
    const { roomName, socketID} = req.body;
    const roomData = {
      roomID: generateUUID(),
      roomName: roomName,
      user1Socket: socketID,
      user2Socket: socketID
    }
    const roomData2 = JSON.stringify(roomData)
    if(!redisClient.isOpen){
      redisClient.connect()
    }
    const roomData3 = redisClient.get(roomName)
    if(roomData3){
      res.status(400).send("create unique name")
    }else{
      redisClient.set(roomName, roomData2, 'EX', 36000, (err,rply)=>{
        if(err){
          console.log(err)
        }else{
          console.log(rply)
        }
      })
    }    
    res.status(200).send("room created")
  }catch(err){
    console.log(err)
  }
}

const addUser = async (req,res)=>{
  const { roomName, socketID, roomID } = req.body;  
  const data1 = await redisClient.get(roomName)
  data1["user2Socket"] = socketID;
  redisClient.set
  res.status(200).send("user added")
}

const sendOffer = async(req,res)=>{
  const { receiverID, offer } = req.body;
  await io.to(receiverID).emit("to receiver", offer);
  res.status(200).send("offer send")
}

const sendIceCandidate = async(req,res)=>{
  const {receiverID, iceCandidate} = req.body;
  io.to(receiverID).emit("iceCandidate", iceCandidate);
  res.status(200).send("iceCandidate added")
}

function generateUUID(){
  return uuidv4();
}

module.exports =  {createRoom, addUser, sendOffer, sendIceCandidate} 