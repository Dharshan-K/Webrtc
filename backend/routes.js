const express = require("express")
const routes = express.Router()
const { createRoom, addUser, sendIceCandidate } = require("./Controller/room")
const { userData, redisData, postUserData } = require("./Controller/connectRedis")

routes.route("/createRoom").post(createRoom)
routes.route("/joinRoom").post(addUser)
routes.route("/sendIceCandidate").post(sendIceCandidate)
routes.route("/userData").post(userData)
routes.route("/redisData").post(redisData)
routes.route("/postUserData").post(postUserData)

module.exports = { routes };
