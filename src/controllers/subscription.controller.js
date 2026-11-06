import mongoose, { isValidObjectId } from "mongoose";
// import mongoose form 'mongoose'
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
// import { subscribe } from "diagnostics_channel";


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
const toggleSubscription = asyncHandler(async (req, res) => {
  // TODO: toggle subscription
  const { channelId } = req.params;

  // login user id
  const subscriberId = req.user?.id;


  // check whether channel is exist
  const channel = await User.findById(channelId);

  if (!channel) {
    throw new ApiError(400, "channel not found");
  }

  //    check whether user allread subscribe
  const existingSubscription = await Subscription.findOne({
    subscriber: subscriberId,
    channel: channelId,
  });

  if (existingSubscription) {
    await Subscription.findByIdAndDelete(existingSubscription._id);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "unsubscribed successfully"));
  }

 const subscriber =  await Subscription.create({
    subscriber: subscriberId,
    channel: channelId,
  })

 await subscriber.populate("subscriber", "fullName")
 await subscriber.populate("channel", "fullName")


  return res
    .status(200)
    .json(new ApiResponse(200, {subscriber}, "Subscribed successfully"));
});


// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
