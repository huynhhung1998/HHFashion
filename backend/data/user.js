import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import UserModel from "../models/UserModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load file .env
dotenv.config({ path: path.join(__dirname, "../config.env") });

// 👉 Lấy DB connection string giống file bạn đang dùng
const DB = process.env.DB.replace("<PASSWORD>", process.env.DB_PASSWORD);

// Danh sách user mẫu
const users = [
  {
    username: "user1",
    email: "user1@example.com",
    password: "Password@123",
    fullname: "Nguyễn Văn A",
    phone: "0901111222",
    totalSpend: 50000000,
  },
  {
    username: "user2",
    email: "user2@example.com",
    password: "Password@123",
    fullname: "Trần Thị B",
    phone: "0902222333",
    totalSpend: 150000000,
  },
  {
    username: "user3",
    email: "user3@example.com",
    password: "Password@123",
    fullname: "Phạm Văn C",
    phone: "0903333444",
    totalSpend: 600000000,
  },
  {
    username: "user4",
    email: "user4@example.com",
    password: "Password@123",
    fullname: "Lê Thị D",
    phone: "0904444555",
    totalSpend: 1200000000,
  },
  {
    username: "seller1",
    email: "seller1@example.com",
    password: "Seller@123",
    fullname: "Shop Thời Trang ABC",
    role: "seller",
    totalSpend: 200000000,
  },
  {
    username: "admin",
    email: "admin@example.com",
    password: "Admin@123",
    fullname: "Quản trị viên",
    role: "admin",
    totalSpend: 0,
  },
];

mongoose
  .connect(DB)
  .then(() => console.log("✅ MongoDB connected for seeding users"))
  .catch((err) => console.error("❌ DB connection error:", err));

const seedUsers = async () => {
  try {
    await UserModel.deleteMany();
    console.log("🧹 Cleared old users");

    // Dùng create để trigger middleware hash password
    await UserModel.create(users);
    console.log("🌱 Users seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding users:", err);
    process.exit(1);
  }
};

seedUsers();
