import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import  User  from "../models/user.model.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password, category, youtubelink, instagramlink } = req.body;
    
    if (
      [fullName, email, username, password, category, youtubelink, instagramlink].some((field) => field.trim() === "")
    ) {
      throw new ApiError(400, "All fields are required");
    }
  
    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existedUser) {
      throw new ApiError(409, "User with email or username already exists");
    }
  
    const profilephotoLocalPath = req.files?.profilephoto[0]?.path;
    
    if (!profilephotoLocalPath) {
      throw new ApiError(400, "Profile photo required");
    }
    const profilephoto = await uploadonCloudinary(profilephotoLocalPath);
  
    if (!profilephoto) {
      throw new ApiError(400, "Profile photo is required");
    }
  
    const user = await User.create({
      fullName,
      profilephoto: profilephoto.url,
      email,
      username,
      password,
      category,
      youtubelink,
      instagramlink,
    });
  
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    if (!createdUser) {
      throw new ApiError(500, "Something went wrong in registering the user");
    }
  
    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User registration successful"));
  });
  
  export { registerUser };
  


// let profilephotoLocalPath;
  // if(req.files && Array.isArray(req.files.profilephoto) && req.files.profilephoto.length > 0){
  //     profilephotoLocalPath = req.files.profilephoto[0].path
  // }