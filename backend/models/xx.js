// models/ProductModel.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    img: [{ type: String, required: true }],

    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
        required: false,
      },
    ],

    quantity: { type: Number, required: true },
    remaining: { type: Number, default: 0 },

    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: false },

    totalRating: { type: Number, default: 0 },
    rate_counting: { type: Number, default: 0 },
    traded_count: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["Đang bán", "Ngưng bán", "Hết hàng"],
      default: "Đang bán",
    },
     sex: {
      type: String,
      enum: ["Nam", "Nữ", "Trẻ em", "Unisex"],
      default: "Unisex",
    },

    description: { type: String, required: true },

    onDeploy: { type: Boolean, default: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true, // thêm createdAt, updatedAt
  }
);

// Virtual field: tính curRating động
productSchema.virtual("curRating").get(function () {
  return this.rate_counting === 0
    ? 0
    : this.totalRating / this.rate_counting;
});

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;