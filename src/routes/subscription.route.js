
import express from 'express'

const route = express.Router()
import {toggleSubscription, getUserChannelSubscribers, getSubscribedChannels } from "../controllers/subscription.controller.js"
import {  verifyJWT } from '../middleware/auth.middleware.js';

// const toggleSubscription = asyncHandler(async (req, res) => {
//     const { channelId } = req.params;

//     // Get the logged-in user's ID
//     const subscriberId = req.user?._id;

//     // Check whether the channel exists
//     const channel = await User.findById(channelId);

//     if (!channel) {
//         throw new ApiError(404, "Channel not found");
//     }

//     // Check whether the user is already subscribed
//     const existingSubscription = await Subscription.findOne({
//         subscriber: subscriberId,
//         channel: channelId
//     });

//     if (existingSubscription) {
//         // Unsubscribe
//         await Subscription.findByIdAndDelete(existingSubscription._id);

//         return res.status(200).json(
//             new ApiResponse(200, {}, "Unsubscribed successfully")
//         );
//     }

//     // Subscribe
//     await Subscription.create({
//         subscriber: subscriberId,
//         channel: channelId
//     });

//     return res.status(200).json(
//         new ApiResponse(200, {}, "Subscribed successfully")
//     );
// });


route.post("/c/:channelId",verifyJWT, toggleSubscription )

export default route;