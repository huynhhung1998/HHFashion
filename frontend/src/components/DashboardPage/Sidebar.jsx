// src/components/Dashboard/Sidebar.jsx
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  CreditCard,
  BarChart2,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // ✅ Lấy role từ localStorage
  const role = localStorage.getItem("role");

  // Lắng nghe thay đổi kích thước màn hình
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Danh sách menu đầy đủ
  const allMenuItems = [
    { name: "Bảng điều khiển", path: "/dashboard/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Người dùng", path: "/dashboard/users", icon: <Users size={18} /> },
    { name: "Cửa hàng", path: "/dashboard/stores", icon: <Store size={18} /> },
    { name: "Sản phẩm", path: "/dashboard/products", icon: <Package size={18} /> },
    { name: "Giao dịch", path: "/dashboard/transactions", icon: <CreditCard size={18} /> },
    { name: "Báo cáo", path: "/dashboard/reports", icon: <BarChart2 size={18} /> },
    { name: "Cài đặt", path: "/dashboard/settings", icon: <Settings size={18} /> },
  ];

  // ✅ Nếu là seller → chỉ hiển thị "Cửa hàng" & "Sản phẩm"
  const menuItems =
    role === "seller"
      ? allMenuItems.filter((item) =>
          ["Cửa hàng", "Sản phẩm"].includes(item.name)
        )
      : allMenuItems;

  return (
    <>
      {/* Nút mở sidebar (chỉ mobile) */}
      {!isDesktop && (
        <button
          className="fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-md shadow-md hover:bg-gray-800 transition"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={22} />
        </button>
      )}

      {/* Overlay (chỉ mobile) */}
      <AnimatePresence>
        {isOpen && !isDesktop && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(isDesktop || isOpen) && (
          <motion.aside
            initial={{ x: isDesktop ? 0 : -250 }}
            animate={{ x: 0 }}
            exit={{ x: isDesktop ? 0 : -250 }}
            transition={{ type: "spring", stiffness: 90, damping: 15 }}
            className={`${
              isDesktop
                ? "relative h-screen"
                : "fixed top-0 left-0 h-screen z-50 shadow-xl"
            } w-64 bg-gray-900 text-gray-100 flex flex-col`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h1 className="text-xl font-semibold tracking-wide">
                {role === "seller" ? "Người bán" : "Quản trị viên"}
              </h1>
              {!isDesktop && (
                <button
                  className="p-1 rounded-md hover:bg-gray-800 transition"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Menu */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {menuItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`
                  }
                  onClick={() => !isDesktop && setIsOpen(false)}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="text-gray-400 group-hover:text-white transition"
                  >
                    {item.icon}
                  </motion.div>
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-800 text-xs text-gray-500 text-center">
              © 2025 Hệ thống Quản trị
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
