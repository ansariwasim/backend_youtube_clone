
import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI

 export  const connect = async ()=>{
    try {
          await mongoose.connect(MONGODB_URI)
          console.log("DB connection successfully connected")
    } catch (error) {
         console.log("DB connection failed")
         console.error(error)
         process.exit(1)
    }
}
