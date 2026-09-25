
import mongoose from "mongoose";
import jwt  from "jsonwebtoken";
import bcrypt from 'bcrypt'

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

userSchema.pre("save", async function(next){ 

    if(!this.isModified("password")) return next();


    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
   return  await  bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){

  return  jwt.sign(
        {
            _id: this.id,
            email: this.email,
            username: this.username,
            fullname: this.fullname

        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPRIRY }
    )
}
userSchema.methods.generateRefressToken = function(){

  return  jwt.sign(
        {
            _id: this.id,
          

        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXPRIRY }
    )

}

export const User = mongoose.model("User", userSchema)