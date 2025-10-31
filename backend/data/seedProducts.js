import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/ProductModel.js"; // model sản phẩm
import products from "./products.js"; // file chứa mảng 20 sản phẩm bạn đã tạo

dotenv.config();

const seedProducts = async () => {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected...");

    for (const product of products) {
      // Tìm theo productName, nếu có thì cập nhật, nếu chưa thì tạo mới
      await Product.findOneAndUpdate(
        { productName: product.productName },
        product,
        { upsert: true, new: true }
      );
    }

    console.log("🌱 Products seeded/updated successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    process.exit(1);
  }
};

seedProducts();

