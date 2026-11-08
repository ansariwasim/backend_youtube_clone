
import express from "express"
const route = express.Router()
import {  createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist} from "../controllers/playlist.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"


route.post("/", verifyJWT, createPlaylist)



export default route;