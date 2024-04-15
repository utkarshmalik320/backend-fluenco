
const express = require("express")
const {addCoupon, getAllCoupons, deleteCoupon} = require("../controllers/coupon.controller.js");
const { verifyJWT } = require("../middlewares/auth.middleware.js");
const { updateCoupons } = require("../middlewares/updateInfluencerCoupons.js");


const router = express.Router();


// router.route("/add").post(verifyJWT, addCoupon , updateCoupons)
router.route("/add").post(addCoupon)
router.route("/getCoupons").get(getAllCoupons)
router.route("/deleteCoupon/:id").put(deleteCoupon)

module.exports = router
