
import express from 'express'
const route = express.Router()
import {
    deleteVideo,
     getAllVideos,
      getVideoById,
       publishAVideo, 
       togglePublishStatus,
        updateVideo} from "../controllers/video.controller.js"
 import { verifyJWT } from '../middleware/auth.middleware.js';      
 import { upload } from '../middleware/multer.middleware.js'; 


route.post("/",verifyJWT, upload.fields([
    {
        name: "videoFile",
        maxCount: 1
    },
    {
        name: "thumbnail",
        maxCount: 1,
    }
]), publishAVideo)

export default route;