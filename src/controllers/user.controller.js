import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken'


//  Generate Access Token and Referesh Token // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
const generateAccessAndRefereshTokens = async(userId)=>{

  try {
   const user =  await User.findById(userId)
 const accessToken =  user.generateAccessToken()
  const refreshToken = user.generateRefressToken()
  
  user.refreshToken = refreshToken
 await user.save({validateBeforeSave: false})
return {accessToken, refreshToken}


  } catch (error) {
     throw new ApiError(500, "something went wrong while generateAccess and referesh token")
  }
}

// User Register controller // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
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
      //  Get all data from the user
  const { fullName, userName, email, password } = req.body;

  //  Validation the data - not empty
  if (
    [fullName, userName, email, password].some((field) => field?.trim() == "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exist
  const userAlreadyExist = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (userAlreadyExist) {
    throw new ApiError(409, "user already exists");
  }

  //  check the image path
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;


  // if avatar image not found throw error
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required");
  }

      // - upload them to cloudinary, avatar 
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // avarer image not found
  if (!avatar) {
    throw new ApiError(400, " Avatar is required");
  }

  //    - create user object - create entry in db
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || " ",
    email,
    password,
    userName,
  });

    // - remove password  and refresh token field from respond 
  const createUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

    // - check for user creation 
  if (!createUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createUser, "User registered successfully"));
});


// User Login controller // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
const loginUser = asyncHandler( async(req, res)=>{

  // take data from  req.body
  // validate the data
  // find the user (username and email )
  // compare the password
  //  access and refresh token
  // send cookie


  const {email, userName, password} = req.body

  if(!(email || userName)){
    throw new ApiError(400, "Email and Username is required")
  }

 const user =  await User.findOne({
    $or: [{userName}, {email}]
  })

  if(!user){
    throw new ApiError (404, "User doesnot exist. first you register")
  }

  const isPasswordValid =  await user.isPasswordCorrect(password)
  
  if(!isPasswordValid){
    throw new ApiError(401, "Invalid user credentials password")
  }

const {accessToken, refreshToken} =await generateAccessAndRefereshTokens(user._id);

//  This is optional step 
 const loggedInUser =  await User.findById(user._id).select("-password -refreshToken")

 const options = {
  httpOnly: true,
  secure: true
 }

 return res
 .status(200)
 .cookie("accessToken", accessToken, options)
 .cookie("refreshToken", accessToken, options)
 .json(new ApiResponse(
    200,
    {
      user: loggedInUser, accessToken, refreshToken
    },
    "User logged In Successfully"
 ))






})

// User logout controller // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
const logoutUser = asyncHandler( async (req, res)=>{
   await  User.findByIdAndUpdate(req.user._id,
      {
        $set: { 
            refreshToken : undefined
        }
      },
      {
          new : true
        }
     )

     const options = {
      httpOnly: true,
      secure: true
     }

     return res 
     .status(200)
     .clearCookie("accessToken", options)
       .clearCookie("refreshToken", options)
       .json(new ApiResponse(200,{}, "User logged Out"))
})



// Create RefreshToken // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
const refreshAccessToken = asyncHandler(async(req, res)=>{

   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

   if( !incomingRefreshToken){
    throw new ApiError(401, "Unauthorized request")
   }

 
try {
  

 const decoded = jwt.verify( incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)


  
   const user = await User.findById(decoded?._id)
  
   if(!user){
    throw new ApiError(401, "Invalid refresh token")
   }
  
   if(incomingRefreshToken !== user?.refreshToken){
    throw new ApiError(401, "Refresh token is expired or used");
   }
  
   const options = {
    httpOnly: true,
    secure: true
   }
  
   const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
  
    return res 
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        {accessToken, refreshToken: newRefreshToken},
        "Access token refreshed"
      )
    )
  
  
} catch (error) {
  throw new ApiError(401, error.message || "Invalid refresh token")
}

})


// Password Change  @@@@@@@@@@@@@@@@@
const changeCurrentPassword = asyncHandler( async(req, res)=>{
const {oldPassword, newPassword} = req.body

 const user =  await User.findById(req.user?._id)
 const isPasswordCorrect =  await user.isPasswordCorrect(oldPassword)
 if(!isPasswordCorrect){
  throw new ApiError(400, "Invalid old password" )
 }

 user.password = newPassword
 await user.save({validateBeforeSave: false})

 return res
 .status(200)
 .json(new ApiResponse(200, {}, "Password changed successfully"))

})


// Get CurrentUser @@@@@@@@@@
const getCurrentUser = asyncHandler(async(req, res)=>{

  return res
  .status(200)
  .json(new ApiResponse(200, req.user, "current user fetched successfully"))
})

// @@@@@@@@@@@@@@@@
const updateAccountDetails = asyncHandler(async(req, res)=>{

  const {fullName, email} = req.body
  if(!fullName ||! email){
    throw new ApiError(400, "All fields are required")
  }

  const user = User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
           fullName,
           email: email
      }
    },
    {new:true} // update hone k baad jo information hoti hai . woh data return hota 
  
  ).select("-password")

  return res
  .status(200)
  .json(new ApiResponse (200, user, "Account details updated successfully"))
})

// Avatar Image Update Controller @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
const updateUserAvatar = asyncHandler(async(req, res)=>{

 const avatarLocalPath = req.file?.path

 if(!avatarLocalPath){
  throw new ApiError(400, "Avatar file is missing ")
 }

 const avatar = await uploadOnCloudinary(avatarLocalPath)

 if(!avatar.url){
  throw new ApiError(400, "Error while uploading on avatar ")
 }

  const user = await User.findByIdAndUpdate(
  req.user?._id,
{  
  $set: {
      avatar: avatar.url
  }
},
{new: true}

).select("-password")


return res
.status(200)
.json(new ApiResponse(200, user, "Avatar Image updated successfully"))
})


// Cover Image update controller
const updateUserCoverImage = asyncHandler(async(req, res)=>{

  const coverImageLocalPath = req.file?.path

  if(!coverImageLocalPath){
    throw new ApiError(400, "CoverImage is Required")
  }

   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   if(!coverImage.url){
     throw new ApiError(400, "Errow while coverImage uploading")
   }

   const user =  await User.findByIdAndUpdate( 
    req.user?._id,
    { 
      $set:{
          converImage : coverImage.url
      },
    },
    {new: true}
   ).select("-password")

   return res
   .status(200)
   .json(new ApiError (200, user, "coverImage updated successfully"))
})

export { registerUser, loginUser , logoutUser, refreshAccessToken , changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar ,  updateUserCoverImage};

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@



