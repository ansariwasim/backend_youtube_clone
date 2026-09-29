import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from '../utils/ApiResponse.js'


const registerUser = asyncHandler(async (req, res) => {
  /* 
    - get all data from the user
    - validation the data - not empty
    - check if user already exists
    - check for image, check for avatar
    - upload them to cloudinary, avatar
    - create user object - create entry in db
    - remove password  and refresh token field from respond 
    - check for user creation
    - return res
 
    */

 





  const { fullName, userName, email, password } = req.body;

  if (
    [fullName, userName, email, password].some((field) => field?.trim() == "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const userAlreadyExist = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (userAlreadyExist) {
    throw new ApiError(409, "user already exists");
  }


 const avatarLocalPath =  req.files?.avatar?.[0]?.path
//  const coverImageLocalPath = req.files?.coverImage?.[0]?.path 

 let coverImageLocalPath;
 if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
  coverImageLocalPath = req.files.coverImage[0].path
 }

 if(!avatarLocalPath){
    throw new ApiError(400, "Avatar image is required")
 }

 const avatar = await uploadOnCloudinary(avatarLocalPath)
 const coverImage = await uploadOnCloudinary(coverImageLocalPath)


if(!avatar){
    throw new ApiError(400, " Avatar is required")
}

const user = await User.create({
  fullName,
  avatar: avatar.url,
  coverImage: coverImage?.url || "",
  email, 
  password,
  userName

})

const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
)

if(!createUser){
    throw new ApiError(500, "Something went wrong while registering the user")
}

return res.status(201).json(
    new ApiResponse(200, createUser, "User registered successfully")
)

});




export { registerUser };


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/apiError.js";
// import { User } from "../models/user.model.js";
// import { uploadOnCloudinary } from "../utils/cloudinary.js";
// import { ApiResponse } from "../utils/ApiResponse.js";

// const registerUser = asyncHandler(async (req, res) => {

//   const { fullName, userName, email, password } = req.body;

//   // Validate required fields
//   if (
//     [fullName, userName, email, password].some(
//       (field) => !field || field.trim() === ""
//     )
//   ) {
//     throw new ApiError(400, "All fields are required");
//   }

//   // Normalize values
//   const normalizedUserName = userName.toLowerCase();
//   const normalizedEmail = email.toLowerCase();

//   // Check if user already exists
//   const userAlreadyExist = await User.findOne({
//     $or: [
//       { userName: normalizedUserName },
//       { email: normalizedEmail }
//     ]
//   });

//   if (userAlreadyExist) {
//     throw new ApiError(409, "User already exists");
//   }

//   // Get uploaded files
//   const avatarLocalPath = req.files?.avatar?.[0]?.path;
//   const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

//   // Avatar is required
//   if (!avatarLocalPath) {
//     throw new ApiError(400, "Avatar image is required");
//   }

//   // Upload images to Cloudinary
//   const avatar = await uploadOnCloudinary(avatarLocalPath);
//   const coverImage = await uploadOnCloudinary(coverImageLocalPath);

//   if (!avatar) {
//     throw new ApiError(400, "Avatar upload failed");
//   }

//   // Create user
//   const user = await User.create({
//     fullName,
//     userName: normalizedUserName,
//     email: normalizedEmail,
//     password,
//     avatar: avatar.url,
//     coverImage: coverImage?.url || ""
//   });

//   // Remove password and refresh token from response
//   const createUser = await User.findById(user._id).select(
//     "-password -refreshToken"
//   );

//   if (!createUser) {
//     throw new ApiError(
//       500,
//       "Something went wrong while registering the user"
//     );
//   }

//   return res.status(201).json(
//     new ApiResponse(
//       201,
//       createUser,
//       "User registered successfully"
//     )
//   );
// });

// export { registerUser };

