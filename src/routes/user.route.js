import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js"; 
import {refreshAccessToken } from '../controllers/user.controller.js'
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
route.post("/refresh-token").post(refreshAccessToken)

export default route;
