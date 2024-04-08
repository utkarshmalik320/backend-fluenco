import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Coupon from "../models/coupon.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createCoupon = asyncHandler(async (req, res) => {

        const { brand, category, coupon_code, valid_till, product_link, terms_and_conditions } = req.body;
        if (!brand,  !category, !coupon_code, !valid_till , !product_link , !terms_and_conditions ) {
            throw new ApiError(400, "All fields are required");
        }

        const existingCoupon = await Coupon.findOne({ 
            $or: [{coupon_code}],
         });
        if (existingCoupon) {
            throw new ApiError(409, "Coupon with the same code already exists");
        }

        const coupon = await Coupon.create({
            brand,
            category,
            coupon_code,
            valid_till,
            product_link,
            terms_and_conditions
        });

        const createdCoupon = await Coupon.findById(coupon._id);
        if (!createdCoupon) {
            throw new ApiError(500, "Something went wrong in creating the coupon");
        }

        return res.status(201).json(new ApiResponse(200, createdCoupon, "Coupon created successfully"));
    });

// const getCoupons = asyncHandler(async (req, res) => {
//     try {
//         const { page = 1, limit = 10 } = req.query;

//         const options = {
//             page: parseInt(page, 10),
//             limit: parseInt(limit, 10)
//         };

//         const coupons = await Coupon.aggregatePaginate({}, options);
//         return res.status(200).json(new ApiResponse(200, coupons, "Coupons fetched successfully"));
//     } catch (error) {
//         // Handle errors
//       throw new ApiError(401, "Fetching gone wrong ");
//     }
// });

export { createCoupon};
