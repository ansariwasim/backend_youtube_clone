
import express from 'express'
const route = express.Router()
import {
     getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
} from '../controllers/comment.controller.js'
import { verifyJWT } from '../middleware/auth.middleware.js';

// router.route("/:videoId").get(getVideoComments).post(addComment);
// router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

// add comment route
route.post("/c/:videoId",verifyJWT, addComment)
// update comment route
route.post("/update/:commentId", verifyJWT, updateComment)



export default route;