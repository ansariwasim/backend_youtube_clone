import express from "express";
import { 
  registerUser, 
  loginUser, 
  logoutUser ,
   refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js"; 
const route = express.Router();

// Middleware
import { verifyJWT} from '../middleware/auth.middleware.js'

route.post(
  "/register",
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser,
);

route.post("/login", loginUser )

// secured routes
route.post("/logout", verifyJWT ,logoutUser )
route.post("/refresh-token", refreshAccessToken)
route.post("/change-password", verifyJWT,  changeCurrentPassword )
route.get("/current-user", verifyJWT, getCurrentUser)
route.patch("/update-account", verifyJWT, updateAccountDetails)
route.patch("/avatar", verifyJWT, upload.single("avatar"), updateUserAvatar)
route.patch("/coverImage", verifyJWT, upload.single("coverimage"), updateUserCoverImage)
route.get("/c/:username", verifyJWT , getUserChannelProfile)
route.get("/history", verifyJWT, getWatchHistory )

route


export default route;
