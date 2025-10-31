// backend/routes/orderRoutes.js
import express from "express";
import orderController from "../controllers/orderController.js";

const router = express.Router();


router.get("/:id", orderController.getOrderById);
// 🧾 Tạo & lấy tất cả đơn hàng (có lọc, tìm, lọc theo tháng)
router.route("/")
  .get(orderController.getAllOrders)
  .post(orderController.createOrder);

// 👤 Đơn hàng theo người mua
router.get("/active/:id", orderController.getActiveOrdersByBuyer);
router.get("/complete/:id", orderController.getCompletedOrdersByBuyer);
// 🟢 ADMIN / DASHBOARD route
router.put("/dashboard/:id/status", orderController.updateOrderStatusByAdmin);
// 🔄 Cập nhật trạng thái, hoàn tác, ghi chú
router.put("/:id/status", orderController.updateOrderStatus);
router.post("/:id/revert", orderController.revertOrder);

// 🗒️ Ghi chú
router.post("/:id/notes", orderController.addNote);
router.delete("/:id/notes/:index", orderController.deleteNote);

// ❌ Xóa đơn hàng
router.delete("/:id", orderController.deleteOrder);

export default router;
