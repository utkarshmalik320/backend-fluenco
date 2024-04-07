import mongoose from "mongoose";
const { Schema, model } = mongoose;
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const couponSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    coupon_code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    valid_till: {
      type: Date,
      required: true,
    },
    product_link: {
      type: String,
      required: true,
    },
    terms_and_conditions: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

couponSchema.plugin(mongooseAggregatePaginate);

const Coupon = model("Coupon", couponSchema);

export default Coupon;
