import React, { useState } from "react";
import Navbar from "../components/HomePage/Navbar";
import Cart from "../components/CartPage/Cart";
import Order from "../components/CartPage/Order";
import Purchased from "../components/CartPage/Purchased";
import Wishlist from "../components/CartPage/Wishlist";
import NewProducts from "../components/HomePage/NewProducts";
import Footer from "../components/HomePage/Footer";
import { ShoppingCart, Package, CheckCircle, Heart } from "lucide-react";

const CartPage = () => {
  const [activeTab, setActiveTab] = useState("cart");

  const renderContent = () => {
    switch (activeTab) {
      case "cart":
        return <Cart />;
      case "order":
        return <Order />;
      case "purchased":
        return <Purchased />;
      case "wishlist":
        return <Wishlist />;
      default:
        return <Cart />;
    }
  };

  const tabs = [
    { id: "cart", label: "Giỏ hàng", icon: <ShoppingCart size={40} /> },
    { id: "order", label: "Đơn hàng", icon: <Package size={40} /> },
    { id: "purchased", label: "Đã mua", icon: <CheckCircle size={40} /> },
    { id: "wishlist", label: "Yêu thích", icon: <Heart size={40} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Thanh chọn chế độ */}
      <div className="bg-white shadow-sm mt-4 py-6 flex justify-center gap-12 text-center flex-wrap">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`cursor-pointer flex flex-col items-center transition-all ${
              activeTab === tab.id
                ? "text-blue-600 scale-105"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            {tab.icon}
            <span className="mt-2 font-semibold text-lg">{tab.label}</span>
          </div>
        ))}
      </div>

      {/* Nội dung từng tab */}
      <div className="p-6 max-w-5xl mx-auto">{renderContent()}</div>

      <div className="mt-[10rem] md:mt-[12rem]">
          <NewProducts />
        </div>
 <div >
          <Footer />
        </div>
    </div>
  );
};

export default CartPage;
