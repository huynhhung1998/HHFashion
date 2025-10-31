import mongoose from "mongoose";
import dotenv from "dotenv";
import Tag from "../models/TagModel.js"; // đường dẫn model Tag
import tags from "./tags.js"; // file bạn đã có sẵn

dotenv.config(); // Đọc biến môi trường từ .env

const seedTags = async () => {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected...");

    for (const tag of tags) {
      // Tìm theo nameTag, nếu có thì cập nhật, nếu chưa thì tạo mới
      await Tag.findOneAndUpdate(
        { nameTag: tag.nameTag },
        tag,
        { upsert: true, new: true }
      );
    }

    console.log("🌱 Tags seeded/updated successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding tags:", error);
    process.exit(1);
  }
};

seedTags();
