const express = require("express")
const routes = express.Router()
const { createRoom, addUser, sendIceCandidate } = require("./Controller/room")
const { roomData } = require("./Controller/connectRedis")

routes.route("/createRoom").post(createRoom)
routes.route("/joinRoom").post(addUser)
routes.route("/sendIceCandidate").post(sendIceCandidate)
routes.route("/roomData").post(roomData)

module.exports = { routes };
