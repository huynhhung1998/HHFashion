// src/components/DashboardPage/User/StatCard.jsx
import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import { Users, CreditCard, DollarSign } from "lucide-react";

const StatCard = () => {
  const [stats, setStats] = useState({
    khachHang: 0,
    donHang: 0,
    doanhThu: 0,
  });
  const [loading, setLoading] = useState(true);

  const formatCurrency = (value) =>
    value?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, orderRes] = await Promise.all([
          api.get("/users"),
          api.get("/orders"),
        ]);

        const users = userRes.data.data.users || [];
        const orders = orderRes.data.data || [];

        const khachHang = users.filter((u) => u.role === "user").length;
        const donHang = orders.filter((o) => o.status !== "đã hủy").length;
        const doanhThu = orders
          .filter((o) => o.status === "đã nhận")
          .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

        setStats({ khachHang, donHang, doanhThu });
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thống kê:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="text-center text-gray-500 py-4">
        Đang tải dữ liệu thống kê...
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Khách hàng */}
      <div className="flex items-center justify-between bg-blue-500 text-white rounded-lg shadow-md p-6">
        <div>
          <h3 className="text-sm font-medium">Khách hàng</h3>
          <p className="text-2xl font-bold">{stats.khachHang}</p>
        </div>
        <div className="p-3 bg-white/20 rounded-full">
          <Users className="w-6 h-6" />
        </div>
      </div>

      {/* Đơn hàng */}
      <div className="flex items-center justify-between bg-yellow-500 text-white rounded-lg shadow-md p-6">
        <div>
          <h3 className="text-sm font-medium">Đơn hàng</h3>
          <p className="text-2xl font-bold">{stats.donHang}</p>
        </div>
        <div className="p-3 bg-white/20 rounded-full">
          <CreditCard className="w-6 h-6" />
        </div>
      </div>

      {/* Doanh thu */}
      <div className="flex items-center justify-between bg-green-500 text-white rounded-lg shadow-md p-6">
        <div>
          <h3 className="text-sm font-medium">Doanh thu</h3>
          <p className="text-2xl font-bold">{formatCurrency(stats.doanhThu)}</p>
        </div>
        <div className="p-3 bg-white/20 rounded-full">
          <DollarSign className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
