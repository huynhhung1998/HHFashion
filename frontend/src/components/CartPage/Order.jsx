// src/components/OrderPage/Order.jsx
import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import useToast from "@/hooks/useToast";
import {
  Package,
  Calendar,
  Truck,
  ClipboardList,
  ShoppingBag,
  XCircle,
  Repeat,
  MapPin,
  Eye,
  RefreshCw,
} from "lucide-react";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalOrderId, setModalOrderId] = useState(null);
  const [modalInput, setModalInput] = useState("");
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [reorderId, setReorderId] = useState(null);
  const toast = useToast();

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

  const fetchOrders = async () => {
    if (!user?.id) {
      setOrders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/orders/active/${user.id}`);
      const data = res.data?.data || [];
      data.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchOrders();
  }, [user]);

  const ensureNoteArray = (note) => {
    if (!note) return [];
    if (Array.isArray(note)) return note;
    return [String(note)];
  };

  const toggleNotes = (orderId) => {
    setExpandedOrders((prev) => {
      const s = new Set(prev);
      if (s.has(orderId)) s.delete(orderId);
      else s.add(orderId);
      return s;
    });
  };

  const openReorderModal = (orderId) => {
    setReorderId(orderId);
    setIsReorderModalOpen(true);
  };

  const confirmReorder = async () => {
    if (!reorderId || !user?.id) return;
    try {
      setLoading(true);
      const res = await api.get(`/orders/${reorderId}`);
      const order = res.data?.data;
      if (!order) throw new Error("Không tìm thấy đơn hàng");

      for (const item of order.products || []) {
        const productId = item.product?._id || item.product?.id || item.product;
        if (!productId) continue;
        await api.post(`/carts/${user.id}`, {
          productId,
          quantity: item.quantity || 1,
          price: item.price,
        });
      }

      await api.delete(`/orders/${reorderId}`);
      await fetchOrders();
      toast.success(
        "Đặt lại thành công!",
        "Tất cả sản phẩm đã được thêm vào giỏ hàng và đơn cũ đã bị xóa."
      );
    } catch (err) {
      console.error("❌ Lỗi khi đặt lại đơn:", err);
      toast.error("Đặt lại thất bại!", "Có lỗi xảy ra khi thêm sản phẩm hoặc xóa đơn hàng.");
    } finally {
      setLoading(false);
      setIsReorderModalOpen(false);
    }
  };

  const openCancelModal = (orderId) => {
    setCancelOrderId(orderId);
    setIsCancelModalOpen(true);
  };

  const confirmCancelOrder = async () => {
    if (!cancelOrderId) return;
    try {
      setLoading(true);
      await api.put(`/orders/${cancelOrderId}/status`, { status: "đã hủy" });
      await fetchOrders();
    } catch (err) {
      console.error("❌ Lỗi khi hủy đơn:", err);
    } finally {
      setLoading(false);
      setIsCancelModalOpen(false);
    }
  };

  const counts = orders.reduce(
    (acc, o) => {
      const status = o.status || "";
      if (status === "đang chờ") acc.waiting++;
      else if (status === "đang vận chuyển") acc.shipping++;
      else if (status === "đã hủy") acc.cancelled++;
      return acc;
    },
    { waiting: 0, shipping: 0, cancelled: 0 }
  );

  const totalValue = orders
    .filter((o) => o.status === "đang chờ" || o.status === "đang vận chuyển")
    .reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);

  if (loading)
    return (
      <div className="flex justify-center py-20 text-gray-500 text-lg">
        Đang tải đơn hàng...
      </div>
    );

  if (!orders || orders.length === 0)
    return (
      <div className="flex justify-center py-20 text-gray-500 text-lg">
        Bạn chưa có đơn hàng nào.
      </div>
    );

  return (
    <div className="p-4 md:p-6 lg:p-10 bg-gray-50 min-h-screen">
       <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* --- DANH SÁCH ĐƠN HÀNG --- */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <h2 className="text-xl md:text-2xl font-semibold mb-2 flex items-center gap-2">
        <ClipboardList className="text-blue-600" /> Đơn hàng của bạn
      </h2>
          {orders.map((order) => {
            const orderId = order.id || order._id;
            return (
              <div
            key={orderId}
            className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-all duration-300"
          >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-3 mb-3 gap-2 sm:gap-0">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Package size={18} />
                    <span className="font-medium">
                      Mã đơn: {String(orderId).slice(-6)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-end">
                    <span
                      className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        order.status === "đang chờ"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "đang vận chuyển"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "đã nhận"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.status}
                    </span>

                    {order.status === "đã hủy" && (
                      <button
                        onClick={() => openReorderModal(orderId)}
                        className="flex items-center gap-1 px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 text-sm"
                      >
                        <Repeat size={16} /> Đặt lại
                      </button>
                    )}

                    {order.status === "đang vận chuyển" && (
                      <button
                        onClick={() => openChangeAddressModal(orderId)}
                        className="flex items-center gap-1 px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
                      >
                        <MapPin size={16} /> Đổi địa chỉ
                      </button>
                    )}

                    {order.status === "đang chờ" && (
                      <button
                        onClick={() => openCancelModal(orderId)}
                        className="flex items-center gap-1 px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 text-sm"
                      >
                        <XCircle size={16} /> Hủy đơn
                      </button>
                    )}

                    <button
                      onClick={() => toggleNotes(orderId)}
                      className="flex items-center gap-1 px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
                    >
                      <Eye size={16} /> Ghi chú
                    </button>
                  </div>
                </div>

                {/* Danh sách sản phẩm */}
                <div className="flex flex-col gap-4">
                  {order.products?.map((item, idx) => {
                    const prod = item.product || {};
                    const img = prod?.img?.[0] || prod?.img || "/placeholder.jpg";
                    return (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row items-center sm:items-start gap-4 border-b last:border-none pb-3"
                      >
                        <img
                          src={img}
                          alt={prod?.productName || "product"}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1 text-center sm:text-left">
                          <h3 className="font-medium text-gray-800">
                            {prod?.productName || prod?.name || "Sản phẩm"}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            {item.quantity} x{" "}
                            {new Intl.NumberFormat("vi-VN").format(item.price)}₫
                          </p>
                        </div>
                        <div className="font-semibold text-blue-600">
                          {new Intl.NumberFormat("vi-VN").format(
                            (item.quantity || 1) * (item.price || 0)
                          )}
                          ₫
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Thông tin phụ */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 text-sm text-gray-600 gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />{" "}
                    <span>
                      Ngày đặt:{" "}
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("vi-VN")
                        : "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck size={16} />{" "}
                    <span>
                      Giao dự kiến:{" "}
                      {order.promisedDeliveryDate
                        ? new Date(order.promisedDeliveryDate).toLocaleDateString(
                            "vi-VN"
                          )
                        : "-"}
                    </span>
                  </div>
                </div>

                {/* Tổng tiền */}
                <div className="text-right mt-3 font-semibold text-lg text-green-600">
                  Tổng:{" "}
                  {new Intl.NumberFormat("vi-VN").format(order.totalPrice || 0)}₫
                </div>

                {/* Ghi chú (mở rộng) */}
                {expandedOrders.has(orderId) && (
                  <div className="mt-3 bg-gray-50 p-3 rounded-md text-sm text-gray-700 animate-fadeIn">
                    <div className="font-medium mb-2">Ghi chú:</div>
                    {ensureNoteArray(order.note).length === 0 ? (
                      <div className="text-gray-500">Chưa có ghi chú.</div>
                    ) : (
                      <ul className="list-disc list-inside space-y-1">
                        {ensureNoteArray(order.note).map((n, i) => (
                          <li key={i}>{n}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* --- TỔNG KẾT ĐƠN HÀNG --- */}
         <div className="lg:col-span-1">
      <div
        className="
          bg-white border rounded-2xl shadow-md p-5 
          sticky top-24 transition-all duration-300
          max-h-[80vh] overflow-auto scrollbar-thin scrollbar-thumb-gray-300
          lg:block
        "
      >
        <h3 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
          <ShoppingBag className="text-green-600" /> Tổng kết đơn hàng
        </h3>

        <div className="text-gray-700 space-y-2 text-sm md:text-base">
          <p>
            Đang chờ:{" "}
            <span className="font-medium text-gray-900">{counts.waiting}</span>
          </p>
          <p>
            Đang vận chuyển:{" "}
            <span className="font-medium text-gray-900">{counts.shipping}</span>
          </p>
          <p>
            Đã hủy:{" "}
            <span className="font-medium text-gray-900">{counts.cancelled}</span>
          </p>
          <p className="mt-3">
            Số tiền cần trả:{" "}
            <span className="font-semibold text-green-600">
              {new Intl.NumberFormat("vi-VN").format(totalValue)}₫
            </span>
          </p>
        </div>

        <button
          className="
            mt-5 w-full bg-blue-600 text-white py-2.5 rounded-lg 
            hover:bg-blue-700 active:scale-[0.98]
            transition-all duration-200 shadow-sm
          "
          onClick={() => (window.location.href = "/cart")}
        >
          Tiếp tục mua sắm
        </button>
      </div>
    </div>
      </div>

      {/* --- MODALS GIỮ NGUYÊN (CŨ) --- */}
      {/* Modal xác nhận hủy đơn */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsCancelModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl animate-scaleIn">
            <h4 className="text-xl font-semibold mb-3 flex items-center gap-2 text-red-600">
              <XCircle /> Xác nhận hủy đơn hàng
            </h4>
            <p className="text-gray-700 mb-5 leading-relaxed">
              Bạn có chắc chắn muốn hủy đơn hàng này không?
              <br />
              <span className="text-gray-500 text-sm">
                (Hành động này không thể hoàn tác)
              </span>
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Không
              </button>
              <button
                onClick={confirmCancelOrder}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-sm"
              >
                Có, hủy đơn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận đặt lại đơn */}
      {isReorderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsReorderModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl animate-scaleIn">
            <h4 className="text-xl font-semibold mb-3 flex items-center gap-2 text-blue-600">
              <RefreshCw /> Xác nhận đặt lại đơn
            </h4>
            <p className="text-gray-700 mb-5 leading-relaxed">
              Bạn có muốn đặt lại đơn hàng này không?
              <br />
              <span className="text-gray-500 text-sm">
                Hệ thống sẽ thêm sản phẩm của đơn hàng này vào giỏ hàng.
              </span>
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsReorderModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Không
              </button>
              <button
                onClick={confirmReorder}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                Có, đặt lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
