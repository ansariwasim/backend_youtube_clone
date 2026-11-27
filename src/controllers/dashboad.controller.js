import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

const getChannelStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const channelStats = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },

    // Get all videos uploaded by this user
    {
      $lookup: {
        from: "videos",
        localField: "_id",
        foreignField: "owner",
        as: "videos",
      },
    },

    // Get all subscribers of this channel
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },

    // Get likes on this channel's videos
    {
      $lookup: {
        from: "likes",
        let: {
          videoIds: "$videos._id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$video", "$$videoIds"],
              },
            },
          },
        ],
        as: "likes",
      },
    },

    // Calculate channel statistics
    {
      $project: {
        totalVideos: {
          $size: "$videos",
        },

        totalVideoViews: {
          $sum: "$videos.views",
        },

        totalSubscribers: {
          $size: "$subscribers",
        },

        totalLikes: {
          $size: "$likes",
        },
      },
    },
  ]);

  if (!channelStats || channelStats.length === 0) {
    throw new ApiError(404, "Channel stats not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      channelStats[0],
      "Channel stats fetched successfully"
    )
  );
});


const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const {userId} = req.params;

  if (!userId){
    throw new ApiError(400, "User ID is required");}

    const channel = await User.findById(userId);

    if(!channel){
      throw new ApiError(404, "Channel not found");
    }

const video = await Video.find({owner: userId}).populate("owner", "username email avatar").sort({ createdAt: -1 });

  if (!video || video.length === 0) {
    throw new ApiError(404, "No videos found for this channel");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      video,
      "Channel videos fetched successfully"
    )
  );

});

export { getChannelStats, getChannelVideos };
