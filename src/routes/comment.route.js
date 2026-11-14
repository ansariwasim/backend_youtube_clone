
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

route.post("/c/:videoId",verifyJWT, addComment)


export default route;