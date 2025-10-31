// src/components/DashboardPage/User/UserTable.jsx
import React, { useEffect, useState } from "react";
import api from "@/utils/api";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const formatCurrency = (value) =>
    value?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, orderRes] = await Promise.all([
          api.get("/users"),
          api.get("/orders"),
        ]);
        setUsers(userRes.data.data.users || []);
        setOrders(orderRes.data.data || []);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="text-center">Đang tải dữ liệu...</p>;

  // Lọc chỉ user có role = "user"
  const customers = users.filter((u) => u.role === "user");

  // Tính tổng số tiền đã chi cho từng user
  const userSpending = customers.map((user) => {
    const totalSpent = orders
      .filter(
        (o) =>
          o.status === "đã nhận" &&
          o.buyer?._id === user._id // order của user đó
      )
      .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    return { ...user, totalSpent };
  });

  // Phân trang
  const totalPages = Math.ceil(userSpending.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedUsers = userSpending.slice(start, end);

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 overflow-x-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Danh sách khách hàng
      </h2>

      <table className="min-w-full border border-gray-200 text-sm">
        <thead>
          <tr className="bg-gray-100 text-left text-gray-600">
            <th className="px-4 py-2 border-b">Ảnh</th>
            <th className="px-4 py-2 border-b">Tên</th>
            <th className="px-4 py-2 border-b">Số điện thoại</th>
            <th className="px-4 py-2 border-b">Ngày tạo</th>
            <th className="px-4 py-2 border-b text-right">Số tiền đã chi</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">
                  <img
                    src={user.avatar || "/default-avatar.png"}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="px-4 py-2 border-b">{user.fullname}</td>
                <td className="px-4 py-2 border-b">{user.phone || "-"}</td>
                <td className="px-4 py-2 border-b">{formatDate(user.createdAt)}</td>
                <td className="px-4 py-2 border-b text-right text-green-600 font-medium">
                  {formatCurrency(user.totalSpent)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                Không có khách hàng nào
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Trước
          </button>
          <span className="text-sm text-gray-700">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default UserTable;
