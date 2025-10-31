// src/components/DashboardPage/Store/StoreLayout.jsx
import React, { useEffect, useState, useRef } from "react";
import api from "@/utils/api";
import {
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import OrderProductsModal from "./OrderProductsModal";
import NotesModal from "./NotesModal.jsx";

export default function StoreLayout() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [handlerFilter, setHandlerFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);

  const clickCounts = useRef({});
  const passwordAttempts = useRef({});

  // Load user info
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch {
        setUser(null);
      }
    };
    loadUser();
    window.addEventListener("storage", loadUser);
    window.addEventListener("userUpdated", loadUser);
    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("userUpdated", loadUser);
    };
  }, []);

  // Fetch orders (có phân trang)
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders", {
        params: {
          page,
          limit,
          search,
          status: statusFilter || "tất cả",
          month: monthFilter,
        },
      });
      const data = res.data?.data || [];
      setOrders(data);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Fetch orders error:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter, monthFilter, search]);

  const statusColors = {
    "đang chờ": "bg-yellow-100 text-yellow-700",
    "đang vận chuyển": "bg-blue-100 text-blue-700",
    "đã nhận": "bg-green-100 text-green-700",
    "đã hủy": "bg-red-100 text-red-700",
  };

  // update status
  const handleStatusChange = async (order, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === order._id ? { ...o, status: newStatus } : o))
    );
    try {
      await api.put(`/orders/dashboard/${order._id}/status`, {
        status: newStatus,
        handlerId: user?.id,
      });
      fetchOrders();
    } catch (err) {
      console.error("Update status failed:", err);
      fetchOrders();
    }
  };

  // triple click revert
  const handleTripleClick = (order) => {
    if (order.status !== "đã nhận") return;
    const id = order._id;
    clickCounts.current[id] = (clickCounts.current[id] || 0) + 1;
    setTimeout(() => {
      clickCounts.current[id] = Math.max((clickCounts.current[id] || 1) - 1, 0);
    }, 1000);
    if (clickCounts.current[id] >= 3) {
      const password = window.prompt("Nhập mật khẩu để hoàn tác đơn:", "");
      if (password === null) return;
      if (password === "0793656522") {
        api.post(`/orders/${id}/revert`)
          .then(fetchOrders)
          .catch(() => alert("Hoàn tác thất bại"));
      } else {
        passwordAttempts.current[id] =
          (passwordAttempts.current[id] || 0) + 1;
        if (passwordAttempts.current[id] >= 3) {
          alert("Sai mật khẩu quá 3 lần. Đăng xuất...");
          api.post("/auth/logout").finally(() => window.location.reload());
        } else {
          alert(`Sai mật khẩu. Còn ${3 - passwordAttempts.current[id]} lần.`);
        }
      }
      clickCounts.current[id] = 0;
    }
  };

  // mở modals
  const handleProductsClick = (order) => {
    setSelectedOrder(order);
    setShowProductsModal(true);
  };
  const handleNotesClick = (order) => {
    setSelectedOrder(order);
    setShowNotesModal(true);
  };

  const uniqueHandlers = Array.from(
    new Set(orders.map((o) => o.handler?.fullname).filter(Boolean))
  );

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
  <div className="max-w-7xl mx-auto space-y-6">
    <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
      <span>📦</span> Quản lý đơn hàng
    </h2>

    {/* Bộ lọc */}
    <div className="flex flex-wrap gap-3 items-center bg-white/90 backdrop-blur-sm shadow-md p-4 rounded-2xl border border-gray-200">
      <div className="relative flex-1 min-w-[220px]">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="🔍 Tìm theo tên, liên hệ, mã đơn..."
          className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-sm 
                     focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      <select
        className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
        value={statusFilter}
        onChange={(e) => {
          setPage(1);
          setStatusFilter(e.target.value);
        }}
      >
        <option value="">Tất cả trạng thái</option>
        <option value="đang chờ">🕓 Đang chờ</option>
        <option value="đang vận chuyển">🚚 Đang vận chuyển</option>
        <option value="đã nhận">✅ Đã nhận</option>
        <option value="đã hủy">❌ Đã hủy</option>
      </select>

      <select
        className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
        value={handlerFilter}
        onChange={(e) => setHandlerFilter(e.target.value)}
      >
        <option value="">👤 Tất cả người xử lý</option>
        {uniqueHandlers.map((h) => (
          <option key={h}>{h}</option>
        ))}
      </select>

      <input
        type="month"
        className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
        value={monthFilter}
        onChange={(e) => {
          setPage(1);
          setMonthFilter(e.target.value);
        }}
      />

      <button
        onClick={() => {
          setSearch("");
          setStatusFilter("");
          setMonthFilter("");
          setHandlerFilter("");
          setPage(1);
        }}
        className="ml-auto px-4 py-2 rounded-xl bg-gradient-to-r from-gray-200 to-gray-100 
                   hover:from-gray-300 hover:to-gray-200 text-gray-700 font-medium 
                   border border-gray-300 transition"
      >
        🔄 Reset
      </button>
    </div>

    {/* Bảng đơn hàng */}
    <div className="overflow-x-auto bg-white shadow-lg rounded-2xl border border-gray-200">
      {loading ? (
        <div className="flex justify-center p-10">
          <Loader2 className="animate-spin text-blue-400" size={32} />
        </div>
      ) : (
        <AnimatePresence>
          <motion.table
            key={page}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="min-w-full text-sm border-collapse"
          >
            <thead className="bg-gradient-to-r from-blue-50 to-indigo-100 text-gray-700">
              <tr>
                {[
                  "Mã đơn",
                  "Người đặt",
                  "Liên hệ",
                  "Sản phẩm",
                  "Tổng tiền",
                  "Ngày đặt",
                  "Trạng thái",
                  "Người xử lý",
                  "Ghi chú",
                ].map((h) => (
                  <th key={h} className="px-4 py-3 border-b font-semibold text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center text-gray-500 py-8">
                    Không có đơn hàng nào.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    onClick={() => handleTripleClick(order)}
                    className="hover:bg-blue-50/50 border-b border-gray-100 last:border-none 
                               transition cursor-default"
                  >
                    <td className="px-4 py-3 font-semibold text-gray-700">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">{order.buyer?.fullname}</td>
                    <td className="px-4 py-3">
                      <div>{order.buyer?.email}</div>
                      <div className="text-xs text-gray-500">
                        {order.buyer?.phone}
                      </div>
                    </td>
                    <td
                      className="px-4 py-3 text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductsClick(order);
                      }}
                    >
                      ({order.products?.length || 0}) sản phẩm
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      {order.totalPrice.toLocaleString("vi-VN")}₫
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-4 py-3">
                      {order.status === "đã nhận" ? (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                            {
                              "đang chờ": "bg-yellow-100 text-yellow-700",
                              "đang vận chuyển": "bg-blue-100 text-blue-700",
                              "đã nhận": "bg-green-100 text-green-700",
                              "đã hủy": "bg-red-100 text-red-700",
                            }[order.status]
                          }`}
                        >
                          {order.status}
                        </span>
                      ) : (
                        <select
                          value={order.status}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleStatusChange(order, e.target.value);
                          }}
                          className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-gray-50 hover:bg-gray-100 focus:ring-2 focus:ring-blue-300"
                        >
                          <option value="đang chờ">đang chờ</option>
                          <option value="đang vận chuyển">đang vận chuyển</option>
                          <option value="đã nhận">đã nhận</option>
                          <option value="đã hủy">đã hủy</option>
                        </select>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-700 font-medium">
                      {order.handler?.fullname || "—"}
                    </td>
                    <td
                      className="px-4 py-3 text-blue-600 hover:underline cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNotesClick(order);
                      }}
                    >
                      {order.note?.length
                        ? order.note[order.note.length - 1]
                            .slice(0, 15)
                            .concat(order.note[order.note.length - 1].length > 15 ? "…" : "")
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </motion.table>
        </AnimatePresence>
      )}
    </div>

    {/* Phân trang */}
    <div className="flex justify-center items-center gap-3 mt-6">
      <button
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
        className="p-2 rounded-xl bg-white border shadow-sm hover:bg-gray-100 disabled:opacity-50 transition"
      >
        <ChevronLeft size={18} />
      </button>
      <span className="text-sm font-medium text-gray-700">
        Trang {page}/{totalPages}
      </span>
      <button
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        disabled={page === totalPages}
        className="p-2 rounded-xl bg-white border shadow-sm hover:bg-gray-100 disabled:opacity-50 transition"
      >
        <ChevronRight size={18} />
      </button>
    </div>

    {/* Modals giữ nguyên */}
    <OrderProductsModal
      isOpen={showProductsModal}
      order={selectedOrder}
      onClose={() => setShowProductsModal(false)}
    />
    <NotesModal
      isOpen={showNotesModal}
      order={selectedOrder}
      onClose={() => setShowNotesModal(false)}
    />
  </div>
</div>
  );
}
