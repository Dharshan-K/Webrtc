const express = require("express")
const routes = express.Router()
const { createRoom } = require("./Controller/room")

routes.route("/createRoom").post(createRoom)

module.exports = { routes };
