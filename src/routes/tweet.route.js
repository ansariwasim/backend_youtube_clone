import express from "express"
import { createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet} from "../controllers/tweet.controller.js"
    import { verifyJWT } from "../middleware/auth.middleware.js"
const route = express.Router()    

route.post("/",verifyJWT, createTweet)

export default route;

