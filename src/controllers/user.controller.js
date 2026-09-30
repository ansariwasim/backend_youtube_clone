import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const generateAccessAndRefereshTokens = async(userId)=>{

  try {
   const user =  await User.findById(userId)
 const accessToken =  user.generateAccessToken()
  const refereshToken = user.generateRefressToken()
  
  user.refereshToken = refereshToken
 await user.save({validateBeforeSave: false})

return {accessToken, refereshToken}
  } catch (error) {
     throw new ApiError(500, "something went wrong while generateAccess and referesh token")
  }
}


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

const loginUser = asyncHandler( async(req, res)=>{

  // take data from  req.body
  // validate the data
  // find the user (username and email )
  // compare the password
  //  access and refresh token
  // send cookie


  const {email, username, password} = req.body

  if(!email || !username){
    throw new ApiError(400, "username and email is required")
  }

 const user =  await User.findOne({
    $or: [{username}, {email}]
  })

  if(!user){
    throw new ApiError (404, "User doesnot exist. first you register")
  }

  const isPasswordValid =  await user.isPasswordCorrect(password)
  
  if(!isPasswordValid){
    throw new ApiError(401, "Invalid user credentials")
  }

generateAccessAndRefereshTokens(user._id);

})

export { registerUser, loginUser };

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@



