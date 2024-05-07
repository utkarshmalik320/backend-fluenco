const { Influencers } = require("../Models/influencer.model")
const jwt = require("jsonwebtoken")

const updateCoupons = async (req,res)=>{
    const token = req.cookies?.accessToken
    const coupon = req.coupon

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const influencer = await Influencers.findById(decodedToken._id)
    console.log(coupon);
    influencer.coupons.push(coupon)
    console.log("Inside update middleware");
    

    await influencer.save()
}

module.exports = {updateCoupons}