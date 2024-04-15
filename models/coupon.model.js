const mongoose = require("mongoose")


const couponSchema = new mongoose.Schema({
    brandName:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    couponCode:{
        type: String,
        required: true,
        unique: true
    },
    expiry:{
        type: String,
        required: true
    },
    websiteLink:{
        type: String,
        required: true
    },
    termsCondition:{
        type: String,
    },
    // influencer:{
    //     type: mongoose.Types.ObjectId,
    //     required: true,
    //     ref: "Influencer"
    // }
}, {timestamps: true})




const Coupons = mongoose.model("Coupon", couponSchema)

module.exports = {Coupons}