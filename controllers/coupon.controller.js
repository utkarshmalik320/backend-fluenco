const { Coupons } = require("../models/coupon.model.js");
const { ApiError } = require("../utils/apiError")
const { ApiResponse } = require("../utils/apiResponse")


const addCoupon  = async(req,res,next)=>{
    try {
        const {brandName, category, couponCode, expiry, websiteLink, termsCondition} = req.body
        const influencer = req.influencer
        const existingCoupon = await Coupons.findOne({couponCode})
        if(existingCoupon){
            return res.status(400).json(
                new ApiResponse(400, {}, "Coupon already exists")
            )
    
        }
        
        if([ category, couponCode,expiry, brandName, websiteLink, termsCondition].some((item)=>item?.trim() === "")){
            throw new ApiError(400, "All fields are required")
        }
    
        const existedCoupon = await Coupons.findOne({couponCode})
        if(existedCoupon){
            throw new ApiError(400, "Coupon already exist")
        }
    
        const coupon = await Coupons.create({
            brandName,
            category,
            couponCode,
            expiry,
            websiteLink,
            termsCondition,
            influencer
    
        })
    
        
        req.coupon = coupon
        const createdCoupon = await Coupons.findById(coupon._id)
        
        if(!createdCoupon){
            throw new ApiError(500, "Something went wrong while creating")
        }
        
        res.status(201).json(
            new ApiResponse(200, createdCoupon, "Coupon created Successfully")
        )
        next();
    } catch (error) {
        console.log(error)
        throw new ApiError(400, "Error in adding a Coupon")
    }
    
}
const getAllCoupons  = async(req,res)=>{
    try {
        const coupons = await Coupons.find({})
        res.status(201).json(
            new ApiResponse(200, coupons, "All coupons recieved")
        )
    } catch (error) {
        throw new ApiError(400, "Coupons not found")
    }

}


const deleteCoupon = async(req,res)=>{
    try {
        const {id} = req.params
        if(!id){
            throw new ApiError(400, "Coupon Code Not Found")
        }
        const coupon = await Coupons.findById(id);

        await coupon.deleteOne(coupon)

        res.status(200).json(
            new ApiResponse(200, "Coupon deleted Successfully")
        )


    } catch (error) {
        throw new ApiError(400, "Cannot delete the Coupon")
    }
}


module.exports = {getAllCoupons, addCoupon, deleteCoupon}