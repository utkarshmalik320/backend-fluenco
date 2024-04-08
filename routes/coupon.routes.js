import express from "express"
import { createCoupon} from "../controllers/coupon.controller.js";


const router = express.Router();


router.route("/addCoupon").post(createCoupon)

// router.route("/getCoupons").get(getCoupons)

export default router