  // src/components/OrderPage/Order.jsx
  import React, { useEffect, useState } from "react";
  import api from "@/utils/api";
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
  } from "lucide-react";

  const Purchased = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // modal đổi địa chỉ
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalOrderId, setModalOrderId] = useState(null);
    const [modalInput, setModalInput] = useState("");

    // modal reorder
    const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
    const [reorderItems, setReorderItems] = useState([]);
    const [reorderOrderId, setReorderOrderId] = useState(null);
    const [reorderProcessing, setReorderProcessing] = useState(false);

    const openReorderModal = (order) => {
      setReorderItems(order.products || []);
      setReorderOrderId(order.id || order._id);
      setIsReorderModalOpen(true);
    };

    const confirmReorder = async () => {
      if (!user?.id || !reorderItems.length) return;

      setReorderProcessing(true);
      try {
        for (const item of reorderItems) {
          const productId =
            typeof item.product === "string"
              ? item.product
              : item.product?._id || item.product?.id;

          if (!productId) continue;

          await api.post(`/carts/${user.id}`, {
            productId,
            quantity: item.quantity || 1,
          });
        }

        setIsReorderModalOpen(false);
        setReorderItems([]);
        setReorderOrderId(null);
      } catch (err) {
        console.error("Lỗi khi đặt lại:", err);
      } finally {
        setReorderProcessing(false);
      }
    };

    // expand notes per order
    const [expandedOrders, setExpandedOrders] = useState(new Set());

    // fetch user từ localStorage
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
        const res = await api.get(`/orders/complete/${user.id}`);
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

    // --- HELPERS -----------------------------------------------------

    const normalizeProductId = (item) => {
      if (!item) return null;
      if (typeof item.product === "string" || typeof item.product === "number")
        return item.product;
      return item.product?._id || item.product?.id || null;
    };

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

    // --- ACTIONS -----------------------------------------------------

    const handleCancelOrder = async (orderId) => {
      if (!user?.id) return alert("Vui lòng đăng nhập");
      if (!confirm("Bạn có chắc muốn hủy đơn này?")) return;

      try {
        setLoading(true);
        await api.put(`/orders/${orderId}`, { status: "đã hủy" });
        await fetchOrders();
        alert("Đã hủy đơn.");
      } catch (err) {
        console.error(err);
        alert("Lỗi khi hủy đơn.");
      } finally {
        setLoading(false);
      }
    };

    const openChangeAddressModal = (orderId) => {
      setModalOrderId(orderId);
      setModalInput("");
      setIsModalOpen(true);
    };

    const closeModal = () => {
      setIsModalOpen(false);
      setModalOrderId(null);
      setModalInput("");
    };

    const handleSaveAddress = async () => {
      if (!modalOrderId) return;
      const newNoteStr = modalInput.trim();
      if (!newNoteStr) return alert("Vui lòng nhập địa chỉ/ghi chú.");

      setLoading(true);
      try {
        const order = orders.find(
          (o) => (o.id || o._id) === modalOrderId || o._id === modalOrderId || o.id === modalOrderId
        );
        const currentNotes = ensureNoteArray(order?.note);
        const updatedNotes = [...currentNotes, newNoteStr];

        await api.put(`/orders/${modalOrderId}`, { note: updatedNotes });
        await fetchOrders();
        alert("Đổi địa chỉ / thêm ghi chú thành công.");
        closeModal();
      } catch (err) {
        console.error(err);
        alert("Lỗi khi lưu địa chỉ/ghi chú.");
      } finally {
        setLoading(false);
      }
    };

    const handleDeleteOrder = async (orderId) => {
      if (!confirm("Bạn chắc chắn muốn xóa order này vĩnh viễn?")) return;
      try {
        setLoading(true);
        await api.delete(`/orders/${orderId}`);
        await fetchOrders();
        alert("Đã xóa order.");
      } catch (err) {
        console.error(err);
        alert("Lỗi khi xóa order.");
      } finally {
        setLoading(false);
      }
    };

    // --- TỔNG KẾT ---------------------------------------------------

    const receivedOrders = orders.filter(o => o.status === "đã nhận");
    const totalReceived = receivedOrders.reduce(
      (sum, o) => sum + Number(o.totalPrice || 0),
      0
    );

    const now = new Date();
    const currentMonthOrders = receivedOrders.filter(o => {
      const created = new Date(o.createdAt);
      return created.getFullYear() === now.getFullYear() && created.getMonth() === now.getMonth();
    });
    const totalThisMonth = currentMonthOrders.reduce(
      (sum, o) => sum + Number(o.totalPrice || 0),
      0
    );

    // --- RENDER ------------------------------------------------------

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
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-7xl mx-auto p-4 sm:p-6">


        {/* Danh sách đơn hàng */}
        <div className="flex-1 flex flex-col gap-5">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 flex items-center gap-2">

            <ClipboardList className="text-blue-600" /> Đơn hàng của bạn
          </h2>

          {receivedOrders.map(order => {
            const orderId = order.id || order._id;
            return (
              <div
                key={orderId}
                className="border rounded-2xl p-4 sm:p-5 bg-white shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
>
                <div className="flex justify-between items-center border-b pb-2 mb-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Package size={18} />
                    <span className="font-medium">Mã đơn: {String(orderId).slice(-6)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openReorderModal(order)}
                     className="ml-0 sm:ml-2 mt-2 sm:mt-0 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm w-full sm:w-auto justify-center"

                    >
                      <Repeat size={16} /> Đặt lại
                    </button>
                    <button
                      onClick={() => toggleNotes(orderId)}
                      className="ml-2 inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
                    >
                      <Eye size={16} /> Xem ghi chú
                    </button>
                  </div>
                </div>

                {/* Danh sách sản phẩm */}
                <div className="flex flex-col gap-3">
                  {order.products?.map((item, idx) => {
                    const prod = item.product || {};
                    const img = prod?.img?.[0] || prod?.img || "/placeholder.jpg";
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-3 sm:gap-4 border-b last:border-none pb-3 flex-wrap sm:flex-nowrap"
                      >
                        <img
                          src={img}
                          alt={prod?.productName || "product"}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg shadow-sm"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">
                            {prod?.productName || prod?.name || "Sản phẩm"}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            {item.quantity} x {new Intl.NumberFormat("vi-VN").format(item.price)}₫
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

                <div className="flex justify-between items-center mt-3 text-sm text-gray-600">
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
                        ? new Date(order.promisedDeliveryDate).toLocaleDateString("vi-VN")
                        : "-"}
                    </span>
                  </div>
                </div>

                <div className="text-right mt-3 font-semibold text-lg text-green-600">
                  Tổng: {new Intl.NumberFormat("vi-VN").format(order.totalPrice || 0)}₫
                </div>

                {expandedOrders.has(orderId) && (
                  <div className="mt-3 bg-gray-50 p-3 rounded-md text-sm text-gray-700">
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

        {/* Tổng kết đơn hàng (sticky) */}
        <div className="w-full lg:w-[340px] shrink-0">
  <div className="bg-white border rounded-2xl shadow-md p-5 sticky top-24 sm:top-28 transition-all">


            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ShoppingBag className="text-green-600" /> Tổng kết đơn hàng
            </h3>
            <div className="text-gray-600 space-y-2">
              <p>
                Tổng đơn đã nhận:{" "}
                <span className="font-semibold text-green-600">
                  {new Intl.NumberFormat("vi-VN").format(totalReceived)}₫
                </span>
              </p>
              <p>
                Chi tiêu tháng {now.getMonth() + 1}:{" "}
                <span className="font-semibold text-blue-600">
                  {new Intl.NumberFormat("vi-VN").format(totalThisMonth)}₫
                </span>
              </p>
            </div>
            <button
              className="mt-5 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
              onClick={() => {
                window.location.href = "/cart";
              }}
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>

        {/* Modal đổi địa chỉ */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={closeModal}
              aria-hidden
            />
            <div className="relative z-10 w-full max-w-md bg-white rounded-2xl p-6 shadow-lg animate-scaleIn animate-fadeIn">

              <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <MapPin /> Đổi địa chỉ / Thêm ghi chú
              </h4>
              <textarea
                className="w-full border rounded-md p-2 min-h-[100px]"
                value={modalInput}
                onChange={(e) => setModalInput(e.target.value)}
                placeholder="Nhập địa chỉ mới hoặc ghi chú..."
              />
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAddress}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal reorder */}
        {isReorderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setIsReorderModalOpen(false)}
              aria-hidden
            />
            <div className="relative z-10 w-full max-w-md bg-white rounded-2xl p-6 shadow-lg animate-scaleIn animate-fadeIn">

              <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Repeat /> Xác nhận đặt lại
              </h4>
              <div className="max-h-80 overflow-y-auto space-y-2">
                {reorderItems.map((item, idx) => {
                  const prod = typeof item.product === "string" ? {} : item.product || {};
                  const img = prod?.img?.[0] || prod?.img || "/placeholder.jpg";
                  return (
                    <div key={idx} className="flex items-center gap-3 border-b pb-2">
                      <img
                        src={img}
                        alt={prod?.productName || "product"}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{prod?.productName || "Sản phẩm"}</h3>
                        <p className="text-gray-500 text-sm">
                          {item.quantity} x {new Intl.NumberFormat("vi-VN").format(item.price)}₫
                        </p>
                      </div>
                      <div className="font-semibold text-blue-600">
                        {new Intl.NumberFormat("vi-VN").format((item.quantity || 1) * (item.price || 0))}₫
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 text-right font-semibold">
                Tổng:{" "}
                {new Intl.NumberFormat("vi-VN").format(
                  reorderItems.reduce(
                    (sum, it) => sum + (it.quantity || 1) * (it.price || 0),
                    0
                  )
                )}
                ₫
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setIsReorderModalOpen(false)}
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                  disabled={reorderProcessing}
                >
                  Hủy
                </button>
                <button
                  onClick={confirmReorder}
                  className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                  disabled={reorderProcessing}
                >
                  {reorderProcessing ? "Đang thêm..." : "Xác nhận"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default Purchased;
