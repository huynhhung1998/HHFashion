// src/components/DashboardPage/Promotion/Promotion.jsx
import { useEffect, useState, useMemo } from "react";
import api from "@/utils/api";
import { Edit, Trash, Percent, BadgeMinus } from "lucide-react";

import AddPromotionModal from "./AddPromotionModal";
import EditPromotionModal from "./EditPromotionModal";
import DeletePromotionModal from "./DeletePromotionModal";

export default function Promotion() {
  const [promotions, setPromotions] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(""); // còn hạn / hết hạn
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editPromotion, setEditPromotion] = useState(null);
  const [deletePromotion, setDeletePromotion] = useState(null);

  const itemsPerPage = 9;

  // Fetch promotions
  const fetchPromotions = async (page = 1) => {
    try {
      const res = await api.get(`/promotions?curPage=${page}&limit=${itemsPerPage}`);
      const data = res.data?.data || [];
      setPromotions(data);
      setTotalPages(res.data?.numberOfPages || 1);
      setCurrentPage(res.data?.curPage || 1);
    } catch (err) {
      console.error("Fetch promotions failed:", err);
      setPromotions([]);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    fetchPromotions(currentPage);
  }, [currentPage]);

  // Lọc promotion
  const filteredPromotions = useMemo(() => {
    let data = [...promotions];
    if (search) {
      data = data.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFilter) {
      data = data.filter((p) => p.status === statusFilter);
    }
    if (typeFilter) {
      data = data.filter((p) => p.scope === typeFilter);
    }
    if (dateFilter) {
      const now = new Date();
      data = data.filter((p) => {
        const end = new Date(p.end_date);
        if (dateFilter === "valid") return end >= now;
        if (dateFilter === "expired") return end < now;
        return true;
      });
    }
    return data;
  }, [promotions, search, statusFilter, typeFilter, dateFilter]);

  const currentItems = filteredPromotions;

  // Toggle trạng thái
  const handleToggleStatus = async (id, newStatus) => {
    try {
      await api.put(`/promotions/${id}`, { status: newStatus });
      setPromotions((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (err) {
      console.error("Toggle status failed:", err);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Toolbar */}
      <div className="bg-white p-5 rounded-lg shadow flex items-center gap-5 flex-wrap">
        <input
          type="text"
          placeholder="Tìm kiếm khuyến mãi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Đang chạy">Đang chạy</option>
          <option value="Tạm dừng">Tạm dừng</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Tất cả loại</option>
          <option value="ORDER">Đơn hàng</option>
          <option value="PRODUCT">Sản phẩm</option>
        </select>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Tất cả hạn dùng</option>
          <option value="valid">Còn hạn</option>
          <option value="expired">Hết hạn</option>
        </select>
        <button
          onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}
          className="border rounded px-3 py-2"
        >
          {viewMode === "grid" ? "Xem dạng bảng" : "Xem dạng lưới"}
        </button>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white rounded px-4 py-2"
        >
          + Thêm khuyến mãi
        </button>
      </div>

      {/* Grid view */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentItems.map((p) => {
            const percentUsed =
              p.usageLimit > 0 ? (p.usedCount / p.usageLimit) * 100 : 0;
            const Icon =
              p.discount_type === "PERCENTAGE" ? Percent : BadgeMinus;

            return (
              <div
                key={p._id}
                className="bg-white rounded-lg shadow p-4 flex flex-col relative"
              >
                {/* Icon */}
                <div className="absolute top-3 left-3 text-gray-500">
                  <Icon size={20} />
                </div>

                {/* Tên + trạng thái */}
                <div className="ml-8">
                  <div className="font-semibold text-lg">{p.name}</div>
                  <span
                    className={`inline-block mt-1 px-2 py-1 text-xs rounded ${
                      p.status === "Đang chạy"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                {/* Scope */}
                <div className="text-sm text-blue-600 mt-1">
                  {p.scope === "ORDER" ? "Đơn hàng" : "Sản phẩm"}
                </div>

                {/* Mã */}
                <div className="mt-2 text-sm text-gray-600">Mã: {p.code}</div>

                {/* Giá trị giảm */}
                <div className="mt-1 font-bold text-blue-600">
                  {p.discount_type === "PERCENTAGE"
                    ? `${p.discount_value}%`
                    : `-${new Intl.NumberFormat("vi-VN").format(
                        p.discount_value
                      )} đ`}
                </div>

                {/* Thời gian */}
                <div className="mt-1 text-xs text-gray-500">
                  {new Date(p.start_date).toLocaleDateString("vi-VN")} →{" "}
                  {new Date(p.end_date).toLocaleDateString("vi-VN")}
                </div>

                {/* Đã sử dụng */}
                <div className="mt-3 text-sm">
                  Đã sử dụng: {p.usedCount}/{p.usageLimit}
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${percentUsed}%` }}
                    ></div>
                  </div>
                </div>

                {/* Toggle + edit/delete */}
                <div className="flex items-center justify-between mt-4">
                  <div
                    className={`relative inline-flex h-6 w-12 items-center rounded-full cursor-pointer transition-colors ${
                      p.status === "Đang chạy" ? "bg-green-500" : "bg-gray-400"
                    }`}
                    onClick={() =>
                      handleToggleStatus(
                        p._id,
                        p.status === "Đang chạy" ? "Tạm dừng" : "Đang chạy"
                      )
                    }
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        p.status === "Đang chạy"
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </div>

                  <div className="flex gap-2 ml-auto">
                    <button
                      onClick={() => setEditPromotion(p)}
                      className="text-blue-600"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => setDeletePromotion(p)}
                      className="text-red-600"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table view */}
      {viewMode === "table" && (
        <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">Tên</th>
                <th className="p-2">Mã</th>
                <th className="p-2">Loại</th>
                <th className="p-2">Giảm</th>
                <th className="p-2">Thời gian</th>
                <th className="p-2">Sử dụng</th>
                <th className="p-2">Trạng thái</th>
                <th className="p-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((p) => (
                <tr key={p._id} className="border-b">
                  <td className="p-2 font-semibold">{p.name}</td>
                  <td className="p-2">{p.code}</td>
                  <td className="p-2">{p.scope === "ORDER" ? "Đơn hàng" : "Sản phẩm"}</td>
                  <td className="p-2">
                    {p.discount_type === "PERCENTAGE"
                      ? `${p.discount_value}%`
                      : `-${new Intl.NumberFormat("vi-VN").format(p.discount_value)} đ`}
                  </td>
                  <td className="p-2 text-sm">
                    {new Date(p.start_date).toLocaleDateString("vi-VN")} →{" "}
                    {new Date(p.end_date).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="p-2 text-sm">
                    {p.usedCount}/{p.usageLimit}
                  </td>
                  <td className="p-2">{p.status}</td>
                  <td className="p-2 flex gap-2">
                    <button onClick={() => setEditPromotion(p)} className="text-blue-600">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => setDeletePromotion(p)} className="text-red-600">
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddPromotionModal
          open={true}
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchPromotions}
        />
      )}
      {editPromotion && (
        <EditPromotionModal
          promotion={editPromotion}
          onClose={() => setEditPromotion(null)}
          onSuccess={fetchPromotions}
        />
      )}
      {deletePromotion && (
        <DeletePromotionModal
          promotion={deletePromotion}
          onClose={() => setDeletePromotion(null)}
          onSuccess={fetchPromotions}
        />
      )}
    </div>
  );
}
