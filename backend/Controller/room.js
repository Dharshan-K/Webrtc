const {redisClient, io}  = require("./connectRedis")

const createRoom = async (req,res)=>{
  try{
    const { roomName, socketID} = req.body;
    const roomData = {
      roomName: roomName,
      user1Socket: socketID,
      user2Socket: socketID
    }
    const roomData2 = JSON.stringify(roomData)
    if(!redisClient.isOpen){
      redisClient.connect()
    }
    redisClient.set(roomName, roomData2, 'EX', 36000, (err,rply)=>{
      if(err){
        console.log(err)
      }else{
        console.log(rply)
      }
    })
    res.status(200).send("room created")
  }catch(err){
    console.log(err)
  }
}

const addUser = async (req,res)=>{
    
}

const sendOffer = async(req,res)=>{
  const { senderID, receiverID, offer } = req.body;
  await io.emit(offer).to(receiverID);
}

module.exports =  {createRoom} 