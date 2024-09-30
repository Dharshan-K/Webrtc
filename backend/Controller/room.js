const client = require("./../index")

const createRoom = async (req,res)=>{
  console.log("creating room")
  console.log(req.body)
  const { roomName, socketID} = req.body;
  client.set('roomName', roomName, 'EX', 36000, (err,rply)=>{
    if(err){
      console.log(err)
    }else{
      console.log(rply)
    }
  })
  res.status(200).send("room created")
}

module.exports = { createRoom }