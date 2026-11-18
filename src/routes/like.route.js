import express from "express";
const route = express.Router();
import {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos,
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

// toggle video like
route.post("/video/:videoId", verifyJWT, toggleVideoLike);
// toggle comment like
route.post("/comment/:commentId", verifyJWT, toggleCommentLike)
//  toggle tweet like
route.post("/tweet/:tweetId", verifyJWT, toggleTweetLike)

export default route;
