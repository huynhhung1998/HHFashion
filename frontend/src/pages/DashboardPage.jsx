// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "../components/DashboardPage/Sidebar";
import Navbar from "../components/HomePage/Navbar";

import DashboardLayout from "../components/DashboardPage/Dashboard/DashboardLayout";
import UserLayout from "../components/DashboardPage/User/UserLayout";
import ProductLayout from "../components/DashboardPage/Product/ProductLayout";
import TransactionLayout from "../components/DashboardPage/Transaction/TransactionLayout";
import SettingsLayout from "../components/DashboardPage/Setting/SettingLayout";
import StoreLayout from "../components/DashboardPage/Store/StoreLayout";

const DashboardPage = () => {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // 🧭 Lấy chiều cao Navbar để đẩy nội dung xuống
  useEffect(() => {
    const navbar = document.querySelector(".app-navbar");
    if (!navbar) return;

    const updateHeight = () => {
      const rect = navbar.getBoundingClientRect();
      setNavbarHeight(rect.height);
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(navbar);
    return () => observer.disconnect();
  }, []);

  // 🌀 Hiệu ứng chuyển trang mượt
  const pageTransition = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3, ease: "easeInOut" },
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* 🧩 Sidebar trái */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* 🧭 Khu vực nội dung */}
      <div className="flex flex-col flex-1 relative">
        {/* Navbar cố định trên đầu */}
        <div >
          <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>

        {/* Phần nội dung chính */}
        <main
          className="flex-1 overflow-y-auto p-6 md:p-8 transition-all duration-300"
          style={{ marginTop: `${navbarHeight}px` }}
        >
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} {...pageTransition}>
              <Routes location={location} key={location.pathname}>
                {/* Khi vào /dashboard thì redirect sang /dashboard/dashboard */}
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DashboardLayout />} />
                <Route path="users" element={<UserLayout />} />
                <Route path="products" element={<ProductLayout />} />
                <Route path="stores" element={<StoreLayout />} />
                <Route path="transactions" element={<TransactionLayout />} />
                <Route path="settings" element={<SettingsLayout />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
