// app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// Routers
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import promotionsRouter from "./routes/promotionRoutes.js";
import tagsRouter from "./routes/tagRoutes.js";
import cartsRouter from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
// Utils
import globalErrorHandle from "./controllers/errorController.js";
import AppError from "./utils/appError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ------------------- Middleware -------------------

// CORS linh hoạt
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://web-fashion-4lr0.onrender.com", // 
    ],
    credentials: true,
  })
);
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Static folder for avatars/images
app.use(
  "/img/avatars",
  express.static(path.join(__dirname, "public/img/avatars"))
);
app.use(
  "/img/products",
  express.static(path.join(__dirname, "public/img/products"))
);

// ------------------- Routes -------------------

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);





app.use("/api/promotions", promotionsRouter);
app.use("/api/tags", tagsRouter);

// ------------------- 404 Not Found -------------------
app.get("/", (req, res) => {
  res.send("✅ Backend server is running on Render!");
});

// ------------------- 404 Not Found -------------------
app.use((req, res, next) => {
  next(new AppError(`Không tìm thấy ${req.originalUrl} trên server này!`, 404));
});


// ------------------- Global Error Handler -------------------
app.use(globalErrorHandle);

export default app;
