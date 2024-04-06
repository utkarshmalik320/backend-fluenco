import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser  =  asyncHandler( async (req, res) => {
     //get user credentials from the frontend
    // validation not empty 
    // check if the user already exists
    // check for images
    // uload to cloudinarty
    // create user objects  = create entry in db
    // remove password and refresh token  from respomse 
    // remove for user creation
    //return  res 


    const {fullName, email, username, password } =  req.body;
    console.log("email: " + email);

    if(
        [fullName, email, username, password].some((field) => 
        field.trim() === "")
    ){
        throw new ApiError(400, "All Field are required")
    }

     const existedUser = User.findOne({
        $or: [ { username } , { email }]
    })
    if(existedUser){
        throw new ApiError(409 , "User with email or username already exists")
    }

    const profilephotoLocalPath =  req.files?.profilephoto[0]?.path
    if(!profilephotoLocalPath){
        throw new ApiError(400, "Profile photo required")
    }
    const profilephoto = await uploadonCloudinary(profilephotoLocalPath)

    if(!profilephoto){
        throw new ApiError(400, "profile photo is required")
    }
    const user =   await User.create({
        fullName,
        profilephoto : profilephoto.url,
        email,
        username: username.lowercase(),
        category :category.lowercase(),
        youtubelink,
        instagramlink
    })

    const createdUser=  await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser) {
        throw new ApiError(500, "Something went wrong in registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser ,"user registration successful")
    )
})

export {
    registerUser,
}