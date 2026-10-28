import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
     if([title, description].some((fields)=> !fields || fields?.trim() == "")){
        throw new ApiError(400, "required filed are missing")
     }

     const videoFileLocalPath = req.files?.videoFile?.[0]?.path
     const thumbnaillocalPath = req.files?.thumbnail?.[0]?.path

     if( !videoFileLocalPath || !thumbnaillocalPath){
        throw new ApiError(400, "vedeoFile and thumbnail are required")
     }

//  video and thubnail upload on cloudnary
     const videoFile = await uploadOnCloudinary(videoFileLocalPath)
     const thumbnail = await uploadOnCloudinary(thumbnaillocalPath)

const video = await Video.create({

    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    title,
    description,
    duration: videoFile.duration,
    owner: req.user._id
})

 if(!video){
    throw new ApiError(500, "something went wronge while video uploading")
 }

 return res
 .status(201)
 .json(new ApiResponse(200, {video}, "Video creating succssfully"))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
 
const video = await Video.findById(videoId)

if(!video){
    throw new ApiError(400, "video not found")
}

// check wheter the login user create this video
if(video.owner.toString() !== req.user._id.toString()){
   throw new ApiError(400, "you are not authorized to delete this video")
} 




    const deleteVideo = await Video.findByIdAndDelete(videoId)
        



      
    
    return res
    .status(200)
    .json(new ApiResponse(200, {deleteVideo}, "Deleted video successfully"))
  


})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}