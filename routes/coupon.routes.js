import express from "express"
import { createCoupon, getCoupons } from "../controllers/coupon.controller.js";


const router = express.Router();


router.route("/addCoupon").post(createCoupon)

router.route("/getCoupons").post(getCoupons)

export default router