const { Influencers } = require("../Models/influencer.model.js")
const { ApiError } = require("../utils/apiError.js")
const { ApiResponse } = require("../utils/apiResponse.js")
const { uploadOnCloudinary } = require("../utils/cloudinary.js")
const bcrypt = require("bcrypt")
const { generateAccessAndRefresTokens } = require("../utils/tokens.js")


const registerInfluencer = async(req,res)=>{
    const {name, username, category, password, email, youtubeLink, instagramLink} = req.body
    if(
        [name, username, category, password].some((field)=> field?.trim() === "")    
    ){
        throw new ApiError(400, "Name, username, category, password are required fields")
    }

    const existedUser = await Influencers.findOne({
        $or: [{ username }, { email }]
    })

    if(existedUser){
        throw new ApiError(409, "User already exists")
    }

    let avatar = ""; // Initialize avatar to an empty string

    if(req.files && req.files.avatar && req.files.avatar[0]){
        const avatarLocalPath = req.files.avatar[0].path
        avatar = await uploadOnCloudinary(avatarLocalPath)
        if(!avatar){
            throw new ApiError(400, "Error uploading avatar file")
        }
        avatar = avatar.url; // Assuming the URL is stored in avatar.url
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const influencer = await Influencers.create({
        name,
        username: username.toLowerCase(),
        email,
        category,
        youtubeLink,
        instagramLink,
        password: hashedPassword,
        avatar
    })
    
    const createdInfluencer = await Influencers.findById(influencer._id)

    if(!createdInfluencer){
        throw new ApiError(500, "Something went wrong while registering the Influencer")
    }

    return res.status(201).json(
        new ApiResponse(200, createdInfluencer, "User registered successfully")
    )
}


const getAllInfluencers = async(req,res)=>{
    try {
        const influencers = await Influencers.find({})
    
        return res.status(201).json(
            new ApiResponse(200, influencers, "All Influencers achieved successfully")
        )
    } catch (error) {
        throw new ApiError(400, "Not able to get the Influencers")
    }
}


const getInfluencer = async(req,res)=>{
    try {
        const {id} = req.params
        if(!id){
            throw new ApiError(400, "Invalid Influencer Id")
        }
        console.log(id);
        const influencer = await Influencers.findById(id)
        if(!influencer){
            new ApiError(400, "Influencer not found")
        }
        return res.status(201).json(
            new ApiResponse(200, influencer, "Influencer Found")
        )
    } catch (error) {
        throw new ApiError(400, "Not able to find the influencer")
    }
}


const deleteInfluencer = async(req,res)=>{
    try {
        const {id} = req.params
        const influencer = await Influencers.findById(id)
        if(!id){
            throw new ApiError(400, "Not able to find the influencer")
        }
        
        await influencer.deleteOne(influencer);
    
        return res.status(201).json(
            new ApiResponse(200, "Influencer Deleted")
        )
    } catch (error) {
        throw new ApiError(400, "Not able to find the influencer")
    }

}


const loginInfluencer = async(req,res)=>{
    try {
        const{ email, password} = req.body
        // console.log(username, email, password);
        if(!email){
            throw new ApiError(400, "Email is required")
        }
        const influencer = await Influencers.findOne({email}).select("+password +refreshToken")
    
    
        if(!influencer){
            throw new ApiError(404, "User does not exist")
        }
    
        const isPasswordValid = bcrypt.compare(password, influencer.password)
    
        if(!isPasswordValid){
            throw new ApiError(401, "Invalid user credentials")
        }    
    
        const {accessToken, refreshToken} = await  generateAccessAndRefresTokens(influencer._id)
    
        const loggedInInfluencer = await Influencers.findById(influencer._id)
    
        const options = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refresToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    influencer: loggedInInfluencer, accessToken, refreshToken
                },
                "influencer logged In Successfully"
            )
        )
    } catch (error) {
        throw new ApiError(400, "Log In Failed")
    }
     


}


const logOutInfluencer = async(req,res)=>{
    await Influencers.findByIdAndUpdate(
        req.influencer._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refresToken", options)
    .json(new ApiResponse(200,{}, "Influencer Logged Out SuccessFully"))
}

module.exports = {getInfluencer, getAllInfluencers, registerInfluencer, deleteInfluencer, loginInfluencer, logOutInfluencer}