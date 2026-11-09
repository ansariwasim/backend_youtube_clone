import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"


// @@@@@@@@@@@@@@@@@@@@@@@@@
const createPlaylist = asyncHandler(async (req, res) => {
    //TODO: create playlist
    const {name, description} = req.body

    // field are required
    if([name, description].some((field)=> !field || field.trim() == "")){
        throw new ApiError(400, "Name and Description are required")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id,
        Video: []
    })

    return res.status(201).json(new ApiResponse(200, {playlist}, "Created playlist Successfully"))


})

// @@@@@@@@@@@@@@@@@@@@@@@@@
const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(!userId){
        throw new ApiError(400, "user not found")
    }

    const userPlayList = await Playlist.find({
        owner: userId
    }).populate("videos", "videoFile")

    return res.status(200).json(new ApiResponse(200, {userPlayList}, "fetching userPlayList data successfully"))


})

// @@@@@@@@@@@@@@@@@@@@@@@@
const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!playlistId){
        throw new ApiError(400, "Playlist not found@@")
    }

  const playlist = await Playlist.findOne({
    _id: playlistId,
    owner: req.user._id
  }).populate("videos")

if(!playlist){
    throw new ApiError(400, "Playlist not found")
}

  return res.status(200).json(new ApiResponse(200, {playlist}, "fatching playlist successfully"))
})


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    // validation 
    if([playlistId, videoId].some((field)=> !field || field.trim() == "")){
        throw new ApiError(400, "playlistId or videoId are not found")
    }
    // find video
     const video = await Video.findById(videoId)

   if(!video){
    throw new ApiError(400, "video not found")
   }

    //  find playlist
    const playlist = await Playlist.findByIdAndUpdate(playlistId,
        {
          $addToSet: {
            videos: videoId
          }  
        },
        {
            new: true,
            runValidators: true
        }
    )

    if(!playlist){
        throw new ApiError(400, "playlist not found")
    }

    return res.status(201).json(new ApiResponse(201, {playlist}, "Added video on playlist successfully"))
})


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@ 
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if([playlistId, videoId].some((field)=> !field || field.trim() == "")){
        throw new ApiError(400, "playlistId and videoId are required")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(400, "Video not found")
    }

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
        $pull: {
            videos: videoId
        }
    },
    {
        new: true
    }
);

if (!playlist) {
    throw new ApiError(404, "Playlist not found");
}

return res.status(200).json(new ApiResponse( 200, {playlist}, "deleted video from playlist successfully"))
}) 



const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}