import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
});



//  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const { content } = req.body;

  if (!content.trim()) {
    throw new ApiError(400, "Content is required");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Video not found");
  }

  const comment = await Comment.create({

    content,
    video: videoId,
    owner: req.user._id

  });

  return res.status(201).json( new ApiResponse(201, {comment}, "Comment created successfully"))

});



// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  
const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const{commentId} = req.params
  const{content} = req.body

if(!content){
  throw new ApiError(400, "Content is required")
}

const updateComment = await Comment.findOneAndUpdate(
  {
    _id: commentId,
    owner: req.user._id
  },
  {
    $set:{
      content
    }
  },
  {
    new: true,
    runValidators: true
  }
)

if(!updateComment){
  throw new ApiError(400, "updateComment not found or unauthorised user to try update this comment")
}

return res.status(200).json(new ApiResponse(200, {updateComment}, "Comment updated successfully"))

  
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
});

export { getVideoComments, addComment, updateComment, deleteComment };
