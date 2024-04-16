const express = require("express")
const {upload} = require("../middlewares/multer.middleware.js")
const { getAllInfluencers, getInfluencer, registerInfluencer,updateInfluencer, updatePassword , updatePfp, deleteInfluencer, loginInfluencer, logOutInfluencer} = require("../Controllers/influencer.controller.js");
const { verifyJWT } = require("../middlewares/auth.middleware.js");


const router = express.Router();


router.route("/signup").post(
    upload.fields([
        {
        name: "avatar",
        maxCount:1
        }
    ]),
    registerInfluencer
)

router.route("/login").post(loginInfluencer)
router.route("/logout").get(verifyJWT, logOutInfluencer)
router.route("/getAllInfluencers").get(getAllInfluencers)


// Updation routes:-


// 1. Update User Basic InforMation
router.route("/update").post(verifyJWT,updateInfluencer)
// 2. Update User Profile Picture
router.route("/updateProfilePicture").post(verifyJWT,
    upload.fields([
        {
        name: "avatar",
        maxCount:1
        }
    ]), updatePfp)
// 2. Update in password
router.route("/updatePassword").post(verifyJWT, updatePassword)


router.route("/getInfluencer/:id").get(getInfluencer)
router.route("/deleteInfluencer/:id").delete(deleteInfluencer)



module.exports = router