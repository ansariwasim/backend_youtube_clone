
import express from "express";
import { getChannelStats, getChannelVideos } from "../controllers/dashboad.controller.js";
const router = express.Router();
import {verifyJWT} from "../middleware/auth.middleware.js"

// get channel stats
router.get("/stats", verifyJWT, getChannelStats);
// get channel videos 
router.get("/videos/:userId", verifyJWT, getChannelVideos);

export default router;