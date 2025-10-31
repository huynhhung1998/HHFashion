import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import Order from "./models/OrderModel.js";
import orders from "./data/orders.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env từ gốc
dotenv.config({ path: path.join(__dirname, "./config.env") });

const DB = process.env.DB.replace("<PASSWORD>", process.env.DB_PASSWORD);

mongoose
  .connect(DB)
  .then(() => console.log("MongoDB connected for seeding ✅"))
  .catch((err) => console.error(err));

const importData = async () => {
  try {
    //await Order.deleteMany(); // nếu muốn xóa trước
    await Order.insertMany(orders);
    console.log("Seeder data imported ✅");
    process.exit();
  } catch (error) {
    console.error("Seeder error ❌", error);
    process.exit(1);
  }
};

importData();


