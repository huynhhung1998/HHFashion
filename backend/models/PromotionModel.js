// models/PromotionModel.js
import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema({
  description: {
    type: String,
    maxlength: 255,
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
  },
  name: {
    type: String,
    required: true,
    maxlength: 255,
  },
  scope: {
    type: String,
    enum: ["ORDER", "PRODUCT"], 
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: function () {
      return this.scope === "PRODUCT";
    },
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  discount_type: {
    type: String,
    enum: ["PERCENTAGE", "FIXED"], 
    required: true,
  },
  discount_value: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const PromotionModel = mongoose.model("Promotion", promotionSchema);
export default PromotionModel;
