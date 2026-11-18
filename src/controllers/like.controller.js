import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import {Comment} from "../models/comment.model.js"
import {Tweet} from "../models/tweet.model.js"

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;
  //TODO: toggle like on video

  if (!videoId) {
    throw new ApiError(400, "videoId not found");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Video not found");
  }

  const existVideoLike = await Like.findOne({
    video: videoId,
    likedBy: userId,
  });

  if (existVideoLike) {
    await Like.findByIdAndDelete(existVideoLike._id);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Unlike video successfully"));
  }

  const likeVideo = await Like.create({
    video: videoId,
    likedBy: userId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { likeVideo }, "Like video Successfully"));
});


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id
  //TODO: toggle like on comment

  if(!commentId){
    throw new ApiError(400, "CommentId not found")
  }

  const comment = await Comment.findById(commentId)

  if(!comment){
    throw new ApiError(400, "Comment not found")
  }

  const existCommentLike = await Like.findOne({
      comment: commentId,
      likedBy: userId
  })

  if(existCommentLike){
    await Like.findByIdAndDelete(existCommentLike._id)

    return res.status(201).json(new ApiResponse(201, {}, "Comment disLiked Successfully"))
  }

const likeComment =   await Like.create({
    comment: commentId,
    likedBy: userId
  })

  return res.status(200).json(new ApiResponse(200, {likeComment}, "Comment Liked Successfully"))

});


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user._id;
  //TODO: toggle like on tweet
   
  if(!tweetId){
    throw new ApiError(400, "TweetId not found")
  }

  const tweet = await Tweet.findById(tweetId)

  if(!tweet){
    throw new ApiError(400, "Tweet not found")
  }

  const existTweetLike = await Like.findOne({
    tweet: tweetId,
    likedBy: userId
  })

  if(existTweetLike){
    
    await Like.findByIdAndDelete(existTweetLike._id)

    return res.status(200).json(new ApiResponse(200, {} , "Tweet disLiked successfully" ))
  }

const tweetLike = await Like.create({
    tweet: tweetId,
    likedBy: userId
})

return res.status(201).json(new ApiResponse(201, {tweetLike}, "Tweet liked successfully"))

});


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 
const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
const getLikedVideos = await Like.find({
   likedBy: req.user._id,
    video: { $exists: true, $ne: null }
}).populate("video", "videoFile title")


if(getLikedVideos.length === 0){
  throw new ApiError(400, "not found liked video")
}

return res.status(200).json(new ApiResponse(200, {getLikedVideos}, "fetched liked video successfully"))
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
