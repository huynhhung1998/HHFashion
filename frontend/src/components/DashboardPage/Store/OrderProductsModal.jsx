// src/components/DashboardPage/Order/OrderProductsModal.jsx
import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const OrderProductsModal = ({ isOpen, onClose, order }) => {
  if (!order) return null;

  const total = order.products?.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 180, damping: 16 }}
            className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 space-y-6 relative"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Chi tiết đơn hàng</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Info */}
            <div className="space-y-2 text-sm">
              <h3 className="font-medium text-gray-700">Thông tin khách hàng</h3>
              <div className="border rounded-xl p-4 bg-gray-50 space-y-1">
                <p>
                  <span className="font-semibold">Tên khách hàng: </span>
                  {order.buyer?.fullname || "Không có"}
                </p>
                <p>
                  <span className="font-semibold">Số điện thoại: </span>
                  {order.buyer?.phone || "—"}
                </p>
                <p>
                  <span className="font-semibold">Địa chỉ giao hàng: </span>
                  {order.deliveryAddress}
                </p>
              </div>
            </div>

            {/* Order Info */}
            <div className="space-y-2 text-sm">
              <h3 className="font-medium text-gray-700">Thông tin đơn hàng</h3>
              <div className="border rounded-xl p-4 bg-gray-50 grid grid-cols-2 gap-4">
                <p>
                  <span className="font-semibold">Mã đơn hàng: </span>
                  {order._id.slice(-6).toUpperCase()}
                </p>
                <p>
                  <span className="font-semibold">Ngày đặt: </span>
                  {new Date(order.createdAt).toLocaleString("vi-VN")}
                </p>
                <p>
                  <span className="font-semibold">Trạng thái: </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === "đang vận chuyển"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "đang chờ"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "đã nhận"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">Người xử lý: </span>
                  {order.handler?.fullname || "Chưa có"}
                </p>
                {order.note?.length > 0 && (
                  <p className="col-span-2">
                    <span className="font-semibold">Ghi chú: </span>
                    {order.note.join(", ")}
                  </p>
                )}
              </div>
            </div>

            {/* Product List */}
            <div className="space-y-2 text-sm">
              <h3 className="font-medium text-gray-700">Sản phẩm đặt hàng</h3>
              <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 text-left">
                    <tr>
                      <th className="py-2 px-3">Sản phẩm</th>
                      <th className="py-2 px-3">Số lượng</th>
                      <th className="py-2 px-3">Đơn giá</th>
                      <th className="py-2 px-3">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products.map((p, idx) => (
                      <motion.tr
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-t hover:bg-gray-50 transition"
                      >
                        <td className="py-2 px-3 flex items-center gap-2">
                          <img
                            src={p.product?.img?.[0] || "/placeholder.png"}
                            alt={p.product?.productName}
                            className="w-10 h-10 rounded-lg object-cover border"
                          />
                          <span className="font-medium text-gray-700">
                            {p.product?.productName}
                          </span>
                        </td>
                        <td className="py-2 px-3">{p.quantity}</td>
                        <td className="py-2 px-3">
                          {p.price.toLocaleString("vi-VN")} ₫
                        </td>
                        <td className="py-2 px-3 font-medium">
                          {(p.price * p.quantity).toLocaleString("vi-VN")} ₫
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-end p-3 border-t font-semibold text-gray-700">
                  Tổng cộng: {total.toLocaleString("vi-VN")} ₫
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm font-medium transition"
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderProductsModal;
