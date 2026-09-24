
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    lowercase: [true, "Username is alway lowercase"],
    trim: true,
    index: true
},
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    lowercase: true, // Automatically converts the email to lowercase before saving
    trim: true,      // Removes accidental leading/trailing spaces
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  }, 
fullname: {
    type: String,
    required: [true, "fullname is required"],
    trim: true,
    index: true
},
avatar: {
    type: String, // cloudinary url
    required: [true, "avatarImage is required"],
},
coverImage: {
    type: String,  // cloudinary url
},
watchHistory:[ {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video"
}],
password: {
    type: String,
    required: [true, "Password is required"]
},
refreshToken:{
    type: String
}

},{timestamps: true})

export const User = mongoose.model("User", userSchema)