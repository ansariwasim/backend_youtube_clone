// import mongoose, { isValidObjectId } from "mongoose"
import mongoose from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @@@@@@@@@@@@@@@@@@@@@@@@
const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "content is required");
  }

  const tweet = await Tweet.create({
    content,
    owner: req.user._id,
  });

  return res
  .status(201)
  .json(new ApiResponse(200, {tweet}, "created tweet successfully"))
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  
});

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const {tweetId} = req.params
  const {content} = req.body

  const tweet = await Tweet.findById(tweetId)

  if(!tweet){
    throw new ApiError(400, "Tweet not found")
  }
 
  // check whether login user are created tweet
  if(tweet.owner.toString() !== req.user._id.toString()){
    throw new ApiError(400, "unauthorized user")
  }


  const updateTweet = await Tweet.findByIdAndUpdate(tweetId,
    {
      content
    },
    {
      new: true,
      runValidators: true
      
    }
  )

  return res
  .status(200)
  .json(new ApiResponse(200, {updateTweet}, "updated tweet successfully"))



});

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
     const {tweetId} = req.params

     const tweet = await Tweet.findById(tweetId)
     if(!tweet){
      throw new ApiError(400, "Tweet not found")
     }

    //  check login user or create this tweet
     if(tweet.owner.toString() !== req.user._id.toString()){
      throw new ApiError(400, "unauthoried user")
     }

  const deleteTweet =   await Tweet.findByIdAndDelete(tweetId,{
      new: true
     })

     return res
     .status(200)
     .json(new ApiResponse(200, {deleteTweet}, "Deleted tweet successfully"))
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
