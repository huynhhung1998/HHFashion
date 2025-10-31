// src/components/CartPage/Wishlist.jsx
import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import { Trash2, ShoppingCart, Eye, Heart } from "lucide-react";
import ProductDetailModal from "../ProductPage/ProductDetailModal";

const Wishlist = () => {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 🧠 Load user từ localStorage
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

  const getUserId = () => user?.id || user?._id || null;

  const getImageUrl = (img) => {
    if (!img) return "/placeholder.jpg";
    const src = Array.isArray(img) ? img[0] : img;
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    return `${BASE_URL}/${src.replace(/^\/+/, "")}`;
  };

  const normalizeWishlist = (raw) => {
    const items = Array.isArray(raw?.items) ? raw.items : [];
    return {
      ...raw,
      items: items
        .map((it) => {
          if (!it) return null;
          const prod = typeof it.product === "string" ? { _id: it.product } : it.product || {};
          return { product: prod, addedAt: it.addedAt || it.createdAt || null };
        })
        .filter(Boolean),
    };
  };


  const createFlyAnimation = (imgSrc, startX, startY) => {
  const flyImg = document.createElement("img");
  flyImg.src = imgSrc;
  flyImg.style.position = "fixed";
  flyImg.style.left = `${startX}px`;
  flyImg.style.top = `${startY}px`;
  flyImg.style.width = "80px";
  flyImg.style.height = "80px";
  flyImg.style.borderRadius = "50%";
  flyImg.style.objectFit = "cover";
  flyImg.style.zIndex = 9999;
  flyImg.style.transition = "all 0.6s cubic-bezier(0.55, 0.06, 0.68, 0.19)";
  document.body.appendChild(flyImg);

  const targetX = window.innerWidth - 60;
  const targetY = 20;

  requestAnimationFrame(() => {
    flyImg.style.left = `${targetX}px`;
    flyImg.style.top = `${targetY}px`;
    flyImg.style.width = "20px";
    flyImg.style.height = "20px";
    flyImg.style.opacity = "0.3";
  });

  setTimeout(() => flyImg.remove(), 700);
};
  const fetchWishlist = async () => {
    const uid = getUserId();
    if (!uid) return;
    setLoading(true);
    try {
      const res = await api.get(`/wishlist/${uid}`);
      const raw = res.data?.wishlist ?? res.data?.data ?? res.data ?? {};
      const normalized = normalizeWishlist(raw);
      setWishlist(normalized);
    } catch (err) {
      console.error("Lỗi khi lấy wishlist:", err);
      setWishlist({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (getUserId()) fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // 🛒 Thêm vào giỏ hàng
  const handleAddToCart = async (product, e) => {
  e.stopPropagation();
  const uid = getUserId();
  if (!uid) {
    window.location.href = "/login";
    return;
  }

  // lấy vị trí để bay
  let startLeft = 0, startTop = 0;
  try {
    const rect = e.currentTarget.getBoundingClientRect();
    startLeft = rect.left;
    startTop = rect.top;
  } catch {
    startLeft = window.innerWidth / 2;
    startTop = window.innerHeight / 2;
  }

  try {
    await api.post(`/carts/${uid}`, { productId: product._id, quantity: 1 });
    createFlyAnimation(product.img?.[0] || "/placeholder.jpg", startLeft, startTop);
  } catch (err) {
    console.error("Lỗi khi thêm vào giỏ hàng:", err);
  }
};


  // ❌ Xóa sản phẩm khỏi wishlist
  const handleRemoveItem = async (productId) => {
    const uid = getUserId();
    if (!uid) return;
    try {
      await api.delete(`/wishlist/remove/${uid}/${productId}`);
      setWishlist((prev) => ({
        ...prev,
        items: prev.items.filter((i) => {
          const pid = i.product?._id || i.product;
          return pid?.toString() !== productId?.toString();
        }),
      }));
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
    }
  };

  // 🧹 Xóa toàn bộ wishlist
  const handleClearWishlist = async () => {
    const uid = getUserId();
    if (!uid) return;
    if (!window.confirm("Bạn có chắc muốn xóa toàn bộ wishlist không?")) return;
    try {
      await api.delete(`/wishlist/clear/${uid}`);
      setWishlist({ items: [] });
    } catch (err) {
      console.error("Lỗi khi xóa wishlist:", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20 text-gray-500 text-lg">
        Đang tải danh sách yêu thích...
      </div>
    );

  if (!loading && (!wishlist.items || wishlist.items.length === 0))
    return (
      <div className="flex flex-col items-center py-20 text-gray-500 text-lg">
        <p>Bạn chưa có sản phẩm nào trong danh sách yêu thích.</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Danh sách yêu thích ({wishlist.items.length})
        </h2>
        <button
          onClick={handleClearWishlist}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm"
        >
          <Trash2 size={16} /> Xóa toàn bộ
        </button>
      </div>

      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {wishlist.items.map((item, idx) => {
          const product = item.product || {};
          const pid = product._id || product.id || product;
          if (!pid) return null;

          const imageUrl = getImageUrl(product.img);
          const qty = Number(product.quantity ?? 0);
          let stockBadge = { text: "Còn hàng", color: "bg-green-500" };
          if (qty <= 0) stockBadge = { text: "Hết hàng", color: "bg-red-500" };
          else if (qty <= 5) stockBadge = { text: "Sắp hết", color: "bg-yellow-500" };

          return (
            <div
              key={pid + "-" + idx}
              className="bg-white shadow-sm rounded-xl overflow-hidden group relative hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className="relative aspect-[3/4] overflow-hidden cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  src={imageUrl}
                  alt={product.productName || product.name || "product"}
                  onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-[30%]"
                />

                {/* 🧩 Các nút khi hover */}
                {/* 🧩 Các nút khi hover */}
<div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 space-y-3">
  {/* Hàng ngang chứa các icon */}
  <div className="flex items-center justify-center gap-3">
    {/* ❤️ Nút xóa khỏi wishlist */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleRemoveItem(pid);
      }}
      className="p-2 bg-white/40 backdrop-blur-sm rounded-full shadow hover:bg-white/60 transition"
      title="Xóa khỏi danh sách yêu thích"
    >
      <Heart className="w-5 h-5 text-red-500 fill-red-500" />
    </button>

    {/* 👁 Nút xem chi tiết */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        setSelectedProduct(product);
      }}
      className="p-2 bg-white/40 backdrop-blur-sm rounded-full shadow hover:bg-white/60 transition"
      title="Xem chi tiết"
    >
      <Eye className="w-5 h-5 text-white" />
    </button>

    {/* 🛒 Nếu còn hàng → hiển thị nút giỏ hàng */}
    {qty > 0 && (
      <button
        onClick={(e) => handleAddToCart(product, e)}

        className="p-2 bg-white/40 backdrop-blur-sm rounded-full shadow hover:bg-white/60 transition"
        title="Thêm vào giỏ hàng"
      >
        <ShoppingCart className="w-5 h-5 text-white" />
      </button>
    )}
  </div>

  {/* 🧾 Nếu hết hàng → hiện chữ dưới icon */}
  {qty <= 0 && (
    <p className="text-white text-sm font-semibold bg-black/40 px-3 py-1 rounded-full mt-2">
      Sản phẩm tạm thời hết hàng
    </p>
  )}
</div>


                {/* Badge trạng thái hàng */}
                <span
                  className={`absolute top-2 left-2 text-white text-xs font-semibold px-2 py-1 rounded-full ${stockBadge.color}`}
                >
                  {stockBadge.text}
                </span>
              </div>

              <div className="p-3">
                <h3 className="font-semibold text-gray-800 line-clamp-2">
                  {product.productName || product.name || "Không tên sản phẩm"}
                </h3>
                <div className="text-blue-600 font-semibold text-base mt-1 text-right">
                  {new Intl.NumberFormat("vi-VN").format(product.price ?? 0)}₫
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default Wishlist;
