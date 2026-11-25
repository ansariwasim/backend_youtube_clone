//   create server

import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
 const app = express()

// Middleware

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())



// route import 





// Routes declaration




//routes import
import userRoute from '../src/routes/user.route.js'
import videoRouter from '../src/routes/video.route.js'
import tweetRouter from '../src/routes/tweet.route.js'
import subscriptionRouter from '../src/routes/subscription.route.js'
import playlistRouter from '../src/routes/playlist.route.js'
import commentRouter from "../src/routes/comment.route.js"
import likeRouter from "../src/routes/like.route.js"
import dashboardRouter from "../src/routes/dashboad.router.js"

//routes declaration

app.use("/api/v1/user", userRoute )
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/playlists", playlistRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/dashboard", dashboardRouter)
 export {app}



