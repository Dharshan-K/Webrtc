const {createClient} = require("redis");
require('dotenv').config();

const redisClient = createClient({
	password: process.env.REDIS_PASSWORD,
	socket: {
		host: process.env.REDIS_ENDPOINT,
		port: process.env.REDIS_PORT
	}
})

const userData = async (req,res)=>{
  const {userName} = req.body
	console.log("userName", userName)
  const data = await redisClient.get(userName);
  if(data){
    res.status(200).send(data)
  }else{
    res.status(400).send("User doesnt exist.")
  }  
}

const postUserData = async (req,res)=>{
	try{
		const {userName, socketID} = req.body
		if(userName == null || socketID == null){
			res.status(400).send("null value")
		}
		await redisClient.set(userName, socketID, {
			EX: 36000
		})
		res.status(200).send("user updated")
	} catch(err){
		console.log("Error" , err)
		res.status(400).send("error")
	}
}

const redisData = async (req,res)=>{
	const {userName, socketID} = req.body
	console.log("userData3")
	console.log(userName, socketID)
	await redisClient.set(userName, socketID, {
		EX: 36000
	})
	res.status(200).send("Stored the socket data")
}

module.exports = { redisClient, userData, redisData, postUserData }