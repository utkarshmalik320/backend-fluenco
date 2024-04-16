const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")

const influencerSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    avatar:{
        type: String, //This will be a url from cloudinary
    },
    username:{
        type: String,
        // required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    email:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true,
    },
    youtubeLink:{
        type: String,
    },
    instagramLink:{
        type: String
    },
    refreshToken:{
        type:String,
        select: false
    },
    password:{
        type: String, 
        required: true,
        select: false
    },
    coupons:[{
        type: mongoose.Types.ObjectId,
        ref: "Coupon"
    }]
}, {timestamps: true})




influencerSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            username: this.username,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};


influencerSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
}

const Influencers = mongoose.model("Influencer", influencerSchema)

module.exports ={Influencers}