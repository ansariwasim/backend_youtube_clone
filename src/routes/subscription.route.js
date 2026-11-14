
import express from 'express'

const route = express.Router()
import {toggleSubscription, getUserChannelSubscribers, getSubscribedChannels } from "../controllers/subscription.controller.js"
import {  verifyJWT } from '../middleware/auth.middleware.js';



route.post("/c/:channelId",verifyJWT, toggleSubscription )
// all subscriber who subscriber the channel
route.get("/:channelId", verifyJWT, getUserChannelSubscribers)
// all channel 
route.get("/channel/:subscriberId", verifyJWT, getSubscribedChannels)



export default route;