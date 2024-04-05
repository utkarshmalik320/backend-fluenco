const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const influencerSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    profile_photo: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    youtube_link: {
        type: String,
        required: true
    },
    instagram_link: {
        type: String,
        required: true
    },
    instagram_followers: {
        type: Number,
        required: true
    },
    fullname : {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
});

const influencer = mongoose.model('UserProfile', influencerSchema);

module.exports = influencer;
