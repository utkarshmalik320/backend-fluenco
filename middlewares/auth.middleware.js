const jwt = require("jsonwebtoken")
const { Influencers } = require("../Models/influencer.model")
const { ApiError } = require("../utils/apiError")



//Error handling
const verifyJWT = async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken

        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }
        // console.log(token);

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log(process.env.ACCESS_TOKEN_SECRET);
        // console.log(decodedToken._id);
        // console.log(decodedToken);
        const influencer = await Influencers.findById(decodedToken?._id)
        // console.log(influencer);
        if(!influencer){
            throw new ApiError(401, "Invalid Access Token")
        }

        req.influencer = influencer
        next()
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {verifyJWT}