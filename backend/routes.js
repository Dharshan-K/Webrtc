const express = require("express")
const routes = express.Router()
const { userData, redisData, postUserData } = require("./Controller/connectRedis")

routes.route("/userData").post(userData)
routes.route("/redisData").post(redisData)
routes.route("/postUserData").post(postUserData)

module.exports = { routes };
