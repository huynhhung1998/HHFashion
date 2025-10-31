import express from "express";
import cartController from "../controllers/cartController.js";

const router = express.Router();

// 🧾 Lấy giỏ hàng của user bằng id
router.get("/:id", cartController.getCartByUser);

// ➕ Thêm sản phẩm vào giỏ
router.post("/:id", cartController.addToCart);

// ✏️ Cập nhật số lượng sản phẩm trong giỏ
router.put("/:id/:productId", cartController.updateItemQuantity);

// ❌ Xóa 1 sản phẩm khỏi giỏ
router.delete("/:id/:productId", cartController.removeItem);

// 🧹 Xóa toàn bộ giỏ hàng
router.delete("/:id/clear/all", cartController.clearCart);

// 📘 Admin
router.get("/admin/all", cartController.getAllCarts);
router.get("/admin/count", cartController.getCartCount);

export default router;
