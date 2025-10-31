import express from "express";
import wishlistController from "../controllers/wishlistController.js";

const router = express.Router();

// 🧠 Route lấy wishlist
router.get("/", wishlistController.getAllWishlists);
router.get("/:userId", wishlistController.getWishlistByUser);

// 🧠 Thêm sản phẩm vào wishlist
    router.post("/add", wishlistController.addToWishlist);

// ✅ Xóa 1 sản phẩm khỏi wishlist 
router.delete("/remove/:userId/:productId", wishlistController.removeFromWishlist);

// 🧹 Xóa toàn bộ wishlist
router.delete("/clear/:userId", wishlistController.clearWishlist);

// 🔢 Đếm tổng số
router.get("/count/:userId", wishlistController.getTotalWishlistCount);

export default router;
