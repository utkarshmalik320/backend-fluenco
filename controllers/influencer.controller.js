const { Influencers } = require("../Models/influencer.model.js")
const { ApiError } = require("../utils/apiError.js")
const { ApiResponse } = require("../utils/apiResponse.js")
const { uploadOnCloudinary } = require("../utils/cloudinary.js")
const bcrypt = require("bcrypt")
const { generateAccessAndRefresTokens } = require("../utils/tokens.js")


const registerInfluencer = async(req,res)=>{
    try {
        const { name, username, category, password, email, youtubeLink, instagramLink } = req.body;

        if ([name, username, category, password].some((field) => !field || field.trim() === "")) {
            throw new ApiError(400, "Name, username, category, password are required fields");
        }

        const existedUser = await Influencers.findOne({ $or: [{ username }, { email }] });
        if (existedUser) {
            throw new ApiError(409, "User already exists");
        }

        let avatarUrl = "";
        if (req.files && req.files.avatar && req.files.avatar[0] && req.files.avatar[0].path) {
            const avatarLocalPath = req.files.avatar[0].path;
            const avatar = await uploadOnCloudinary(avatarLocalPath);
            if (!avatar) {
                throw new ApiError(400, "Failed to upload avatar");
            }
            avatarUrl = avatar.url;
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const influencer = await Influencers.create({
            name,
            username: username.toLowerCase(),
            email,
            category,
            youtubeLink,
            instagramLink,
            password: hashedPassword,
            avatar: avatarUrl,
        });


        return res.status(200).json(new ApiResponse(200, influencer, "User registered successfully"));
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


const getAllInfluencers = async(req,res)=>{
    try {
        const influencers = await Influencers.find({})
    
        return res.status(201).json(
            new ApiResponse(200, influencers, "All Influencers achieved successfully")
        )
    } catch (error) {
        return res.status(400).json(
            new ApiResponse(400, {}, "Not able to get the Influencers")
        )
        
    }
}


const getInfluencer = async(req,res)=>{
    try {
        const {id} = req.influencer;
        if(!id){
            return res.status(400).json(
                new ApiResponse(400, {}, "Invalid Influencer Id")
            )
        }
        console.log(id);
        const influencer = await Influencers.findById(id)
        if(!influencer){
            return res.status(400).json(
                new ApiResponse(400, {}, "Influencer not found")
            )
        }
        return res.status(201).json(
            new ApiResponse(200, influencer, "Influencer Found")
        )
    } catch (error) {
        return res.status(400).json(
            new ApiResponse(400, {}, "Not able to find the influencer")
        )
        
    }
}


const deleteInfluencer = async(req,res)=>{
    try {
        const {id} = req.params
        const influencer = await Influencers.findById(id)
        if(!id){
            return res.status(400).json(
                new ApiResponse(400, {}, "Not able to find the influencer")
            )
        }
        
        await influencer.deleteOne(influencer);
    
        return res.status(200).json(
            new ApiResponse(200, "Influencer Deleted")
        )
    } catch (error) {
        return res.status(400).json(
            new ApiResponse(400, {}, "Not able to find the influencer")
        )
    }

}

const loginInfluencer = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json(
                new ApiResponse(400, {}, "Email and password are required")
            );
        }

        const influencer = await Influencers.findOne({ email }).select("+password +refreshToken");

        if (!influencer) {
            return res.status(400).json(
                new ApiResponse(400, {}, "Invalid credentials")
            );
        }

        const isPasswordValid = await bcrypt.compare(password, influencer.password);

        if (!isPasswordValid) {
            return res.status(400).json(
                new ApiResponse(400, {}, "Invalid credentials")
            );
        }

        const { accessToken, refreshToken } = await generateAccessAndRefresTokens(influencer._id);
        const loggedInInfluencer = await Influencers.findById(influencer._id);

        const options = {
            httpOnly: true,
            secure: true
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refresToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        influencer: loggedInInfluencer,
                        accessToken,
                        refreshToken
                    },
                    "Influencer logged in successfully"
                )
            );
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json(
            new ApiResponse(500, {}, "Internal server error")
        );
    }
};


const logOutInfluencer = async(req,res)=>{
    try {
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
// Error Handling
catch (error) {
res.status(500).json({
    success: false,
    message: error.message
})}
}

// Influencer Details updation (Will not get registered if username or email already exists in the database)
const updateInfluencer = async (req, res) => {
    try {
        const { name,email, username, category, youtubeLink, instagramLink } = req.body;
        const {id} = req.influencer; 

        
        // const userWithExistingUsername = await Influencers.findOne({ username });
        // if(userWithExistingUsername){
        //     throw new ApiError(400, "Username already exists");
        // }
        let influencer = await Influencers.findById(id);
        if(email == influencer.email){
            const userWithExistingUsername = await Influencers.findOne({ username });
        if(userWithExistingUsername){
            throw new ApiError(400, "Username already exists");

        }

            influencer = await Influencers.findByIdAndUpdate(
                id,
                {
                    $set: {
                        name: name,
                        youtubeLink: youtubeLink,
                        instagramLink: instagramLink,
                        username: username,
                        category: category
                    }
                },
                { new: true }
            );
        }

        else if(username == influencer.username){
            const userWithExistingEmail = await 
     Influencers.findOne({ email });
        if(userWithExistingEmail){
            throw new ApiError(400, "Email already exists");

        }

            influencer = await Influencers.findByIdAndUpdate(
                id,
                {
                    $set: {
                        name: name,
                        youtubeLink: youtubeLink,
                        instagramLink: instagramLink,
                        email: email,
                        category: category
                    }
                },
                { new: true }
            );
        }
        else if(username == influencer.username && email == influencer.email){
            influencer = await Influencers.findByIdAndUpdate(
                id,
                {
                    $set: {
                        name: name,
                        youtubeLink: youtubeLink,
                        instagramLink: instagramLink,
                        category: category
                    }
                },
                { new: true }
            );
        }
        else{
            const userWithExistingEmail = await 
     Influencers.findOne({ email });
        if(userWithExistingEmail){
            throw new ApiError(400, "Email already exists");

        }
        influencer = await Influencers.findByIdAndUpdate(
            id,
            {
                $set: {
                    name: name,
                    youtubeLink: youtubeLink,
                    instagramLink: instagramLink,
                    username: username,
                    email: email,
                    category: category
                }
            },
            { new: true }
        );
    }

        if (!influencer) {
            throw new ApiError("Influencer not found")
        }

        res.status(200).json({
            success: true,
            data: influencer,
            message: "Influencer updated successfully"
        });
    } catch (error) {
        // console.error("Error updating influencer:");
        res.status(500).json({ success: false, error: error.message });
    }
};





// Updating PfP
const updatePfp = async (req, res) => {
    try {
        const {id} = req.influencer;
    
        let influencer = await Influencers.findById(id);
    
        const avatarLocalPath = req.files?.avatar[0]?.path
        console.log(avatarLocalPath);
        if(!avatarLocalPath){  
            return res.status(400).json(
                new ApiResponse(400, {}, "Avatar Local Path  file is required")
            )
        }
        const avatar = await uploadOnCloudinary(avatarLocalPath)
        console.log(avatar);
        if(!avatar){
            return res.status(400).json(
                new ApiResponse(400, {}, "Avatar file is required")
            )
        }
    
        influencer = await Influencers.findByIdAndUpdate(
            id,
            {
                $set: {
                    avatar: avatar?.url || ""
                }
            },
            { new: true }
        )
    
        if(!influencer){
            return res.status(400).json(
                new ApiResponse(400, {}, "cannot update the profile picture")
            )
            
        }
        res.status(200).json(new ApiResponse(200, influencer, "Profile Photo updated successfully"))
    
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });        
    }
    

}



// Updating Password

const updatePassword = async (req, res) => {
   try {
     const {oldPassword, newPassword} = req.body;
 
     const {id} = req.influencer;
     const influencer = await Influencers.findById(id).select("+password");
     if(!influencer){
         return res.status(400).json(
            new ApiResponse(400, {}, "Influencer not found")
        )
     }
     const isPasswordValid = bcrypt.compare(oldPassword, influencer.password);
     if(!isPasswordValid){
         return res.status(400).json(
            new ApiResponse(400, {}, "Invalid old password")
        )
     }
     
     const hashedPassword = await bcrypt.hash(newPassword, 10)
 
     const updatedInfluencer = await Influencers.findByIdAndUpdate(
         id,
         {
             $set:{
                 password: hashedPassword
             }
         },
         {
             new: true
         })
 
 
     return res.status(200).json(new ApiResponse(200, updatedInfluencer, "Password updated successfully"))
     
   } catch (error) {
    res.status(500).json({ success: false, error: error.message });
   }

}






module.exports = {getInfluencer, getAllInfluencers, registerInfluencer, deleteInfluencer, loginInfluencer, logOutInfluencer, 
    // Below are updation methods
    updateInfluencer, updatePfp, updatePassword}


