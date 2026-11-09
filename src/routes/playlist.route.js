
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

// create playlist route 
route.post("/", verifyJWT, createPlaylist)
// get user Playlist route
route.get("/g/:userId", verifyJWT, getUserPlaylists)
// get playlist 
route.get("/:playlistId", verifyJWT, getPlaylistById)
// add video on playlist
route.post ("/:playlistId/:videoId", verifyJWT, addVideoToPlaylist)
// remove video from playlist
route.post ("/d/:playlistId/:videoId", verifyJWT, removeVideoFromPlaylist)
export default route;