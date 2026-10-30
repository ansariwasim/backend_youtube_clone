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


//routes declaration

app.use("/api/v1/user", userRoute )
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/tweets", tweetRouter)


 export {app}



