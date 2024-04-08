import mongoose from "mongoose";
const { Schema, model } = mongoose;
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const couponSchema = new Schema(
  {
    brand: {
      type: String,
      required: [true, 'Brand is required.'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required.'],
      trim: true,
    },
    coupon_code: {
      type: String,
      required: [true, 'Coupon code is required.'],
      unique: true,
      trim: true,
    },
    valid_till: {
      type: String,
      required: [true, 'Valid till date is required.'],
    },
    product_link: {
      type: String,
      required: [true, 'Product link is required.'],
    },
    terms_and_conditions: {
      type: String,
      required: [true, 'Terms and conditions are required.'],
    },
  },
  {
    timestamps: true,
  }
);

couponSchema.plugin(mongooseAggregatePaginate);

const Coupon = model("Coupon", couponSchema);

export default Coupon;
