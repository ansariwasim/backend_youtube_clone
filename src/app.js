//   create server

import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import userRoute from '../src/routes/user.route.js'
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


// Route
app.use("/api/auth", userRoute )

 export {app}



