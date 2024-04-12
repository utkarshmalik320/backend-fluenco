const { Influencers } = require("../Models/influencer.model.js")
const {jwt} = require("jsonwebtoken")
const {ApiError} = require("./apiError")

const generateAccessAndRefresTokens = async(userId)=>{
//    try {
     const user = await Influencers.findById(userId)
     const accessToken = user.generateAccessToken()
     const refreshToken=user.generateRefreshToken()
     user.refreshToken = refreshToken
 
     await user.save({validateBeforeSave: false})
 
     return {accessToken, refreshToken}
 
//    } catch (error) {
//     throw new ApiError(500, "Something went wrong while generating refresh and access tokens")
//    }



}

module.exports = {generateAccessAndRefresTokens}