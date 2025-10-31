// src/components/DashboardPage/Chart/TransactionChart.jsx
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import api from "@/utils/api";

const TransactionChart = () => {
  const [data, setData] = useState([]);

  // 🧮 Tạo danh sách 6 tháng gần nhất
  const getLast6Months = () => {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        name: `Tháng ${date.getMonth() + 1}`,
        value: 0,
      });
    }
    return months;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders");
        const orders = res.data.data || [];
        const last6 = getLast6Months();

        orders
          .filter((o) => o.status === "đã nhận")
          .forEach((order) => {
            const date = new Date(order.createdAt);
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const found = last6.find((m) => m.month === month && m.year === year);
            if (found) found.value += order.totalPrice || 0;
          });

        setData(last6);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu biểu đồ:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          📊 Doanh thu 6 tháng gần nhất
        </h2>
        <span className="text-sm text-gray-500">
          Tính theo các đơn hàng đã nhận
        </span>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="10%" stopColor="#6366f1" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.4} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ fill: "#4b5563" }} />
          <YAxis
            tickFormatter={(v) =>
              v >= 1_000_000
                ? `${(v / 1_000_000).toFixed(1)}tr`
                : v.toLocaleString("vi-VN")
            }
            tick={{ fill: "#4b5563" }}
          />
          <Tooltip
            cursor={{ fill: "rgba(99, 102, 241, 0.1)" }}
            contentStyle={{
              background: "white",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
            formatter={(value) =>
              value.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })
            }
            labelStyle={{ color: "#111827", fontWeight: "500" }}
          />
          <Legend verticalAlign="top" height={30} />
          <Bar
            name="Doanh thu"
            dataKey="value"
            fill="url(#colorRevenue)"
            radius={[8, 8, 0, 0]}
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionChart;
