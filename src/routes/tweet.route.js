import express from "express"
import { createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet} from "../controllers/tweet.controller.js"
    import { verifyJWT } from "../middleware/auth.middleware.js"
const route = express.Router()    

// createTweet route
route.post("/",verifyJWT, createTweet)

// get user all tweets
route.get("/:userId", verifyJWT, getUserTweets)

// update tweet route
route.patch("/:tweetId", verifyJWT, updateTweet)

// delete tweet route
route.get("/:tweetId", verifyJWT, deleteTweet)

export default route;

