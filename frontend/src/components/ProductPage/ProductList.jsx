// src/components/ProductPage/ProductList.jsx
import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import ProductDetailModal from "./ProductDetailModal";
import { useNavigate } from "react-router-dom";

const ProductList = ({ filters, onCounts }) => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const [curPage, setCurPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [buyNowProduct, setBuyNowProduct] = useState(null);


  const navigate = useNavigate();



  useEffect(() => {
  const handleOpenModal = (e) => {
    setSelectedProduct(e.detail);
  };
  window.addEventListener("openProductModal", handleOpenModal);
  return () => window.removeEventListener("openProductModal", handleOpenModal);
}, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        curPage: page,
        ...Object.fromEntries(
          Object.entries(filters || {}).filter(([_, v]) => v !== "" && v != null)
        ),
      });
      const res = await api.get(`/products?${params.toString()}`);
      const data = res.data?.data || [];
      setProducts(Array.isArray(data) ? data : []);
      setCurPage(res.data?.curPage ?? 1);
      setTotalPages(res.data?.numberOfPages ?? 1);
      onCounts({
        visibleCount: data.length,
        totalCount: res.data?.totalItems ?? data.length,
      });
    } catch (err) {
      console.error("Lỗi khi lấy sản phẩm:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/wishlist/${user.id}`);
      setWishlist(res.data?.items?.map((i) => i.product?._id) || []);
    } catch (err) {
      console.error("Lỗi lấy wishlist:", err);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, [filters]);

  useEffect(() => {
    if (user) fetchWishlist();
  }, [user]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurPage(page);
    fetchProducts(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading)
    return (
      <div className="flex justify-center py-20 text-gray-500 text-lg">
        Đang tải sản phẩm...
      </div>
    );

  if (!loading && products.length === 0)
    return (
      <div className="flex justify-center py-20 text-gray-500 text-lg">
        Không tìm thấy sản phẩm nào.
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            user={user}
            isFavorite={wishlist.includes(product._id)}
            onWishlistChange={fetchWishlist}
            onOpenDetail={setSelectedProduct}
            onBuyNow={setBuyNowProduct}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 select-none">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => handlePageChange(num)}
              className={`px-3 py-1 rounded border ${
                curPage === num
                  ? "bg-blue-600 text-white border-blue-600"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      )}

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {buyNowProduct && (
        <BuyNowModal
          product={buyNowProduct}
          user={user}
          onClose={() => setBuyNowProduct(null)}
        />
      )}
    </div>
  );
};

// 🩵 COMPONENT CARD
const ProductCard = ({
  product,
  user,
  isFavorite,
  onWishlistChange,
  onOpenDetail,
  onBuyNow,
}) => {
  const navigate = useNavigate();
  const [heartActive, setHeartActive] = useState(isFavorite);

  useEffect(() => setHeartActive(isFavorite), [isFavorite]);

  const resolveImageUrl = (url) => {
  if (!url) return "/placeholder.jpg";
  if (url.startsWith("http") || url.startsWith("data:image")) return url;
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  return `${BASE_URL}/${url.replace(/^\/+/, "")}`;
};

const img = Array.isArray(product.img) && product.img.length
  ? resolveImageUrl(product.img[0])
  : "/placeholder.jpg";

  const handleAddToWishlist = async (e) => {
    e.stopPropagation();
    if (!user) return navigate("/login");
    try {
      if (heartActive) {
        await api.delete(`/wishlist/remove${user._id}`);
      } else {
        await api.post(`/wishlist/add`, {
          userId: user.id,
          productId: product._id,
        });
      }
      setHeartActive(!heartActive);
      onWishlistChange();
    } catch (err) {
      console.error("Lỗi wishlist:", err);
    }
  };

  const handleAddToCart = async (e) => {
  e.stopPropagation();
  if (!user) return navigate("/login");

  // 🔹 Lưu tọa độ ảnh trước khi await (tránh lỗi event bị mất)
  let startLeft = 0, startTop = 0, imgSrc = "";
  try {
    const imgEl = e.currentTarget.closest("div").querySelector("img");
    const rect = imgEl.getBoundingClientRect();
    startLeft = rect.left;
    startTop = rect.top;
    imgSrc = imgEl.src;
  } catch {
    startLeft = window.innerWidth / 2;
    startTop = window.innerHeight / 2;
  }

  try {
    await api.post(`/carts/${user.id}`, {
      productId: product._id,
      quantity: 1,
    });

    // 🪶 Tạo hiệu ứng bay lên giỏ hàng
    const flyImg = document.createElement("img");
    flyImg.src = imgSrc;
    flyImg.style.position = "fixed";
    flyImg.style.left = `${startLeft}px`;
    flyImg.style.top = `${startTop}px`;
    flyImg.style.width = "300px";
    flyImg.style.height = "300px";
    flyImg.style.borderRadius = "50%";
    flyImg.style.objectFit = "cover";
    flyImg.style.zIndex = 9999;
    flyImg.style.transition =
      "all 0.6s cubic-bezier(0.55, 0.06, 0.68, 0.19)";
    document.body.appendChild(flyImg);

    // 📦 Điểm đến: góc phải trên (vị trí icon giỏ)
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
  } catch (err) {
    console.error("Lỗi thêm vào giỏ hàng:", err);
  }
};


  const stockBadge =
    product.quantity <= 0
      ? { text: "Hết hàng", color: "bg-red-500" }
      : product.quantity <= 5
      ? { text: "Sắp hết", color: "bg-yellow-500" }
      : { text: "Còn hàng", color: "bg-green-500" };

  return (
    <div
      className="bg-white shadow-md rounded-xl overflow-hidden group relative hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      onClick={() => onOpenDetail(product)}
    >
      <div className="relative w-full h-56 overflow-hidden">
        <img
          src={img}
          alt={product.productName}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <span
          className={`absolute top-2 left-2 text-white text-xs font-semibold px-2 py-1 rounded-full ${stockBadge.color}`}
        >
          {stockBadge.text}
        </span>

        {/* Hover actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-3">
          <div className="flex gap-3">
            <button
              onClick={handleAddToWishlist}
              className="bg-white p-2 rounded-full hover:bg-gray-100"
            >
              <Heart
                size={18}
                className={`${
                  heartActive ? "fill-red-500 text-red-500" : "text-gray-700"
                }`}
              />
            </button>
            {product.quantity > 0 && (
              <button
                onClick={handleAddToCart}
                className="bg-white p-2 rounded-full hover:bg-gray-100"
              >
                <ShoppingCart size={18} className="text-gray-700" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetail(product);
              }}
              className="bg-white p-2 rounded-full hover:bg-gray-100"
            >
              <Eye size={18} className="text-gray-700" />
            </button>
          </div>

          {product.quantity > 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBuyNow(product);
              }}
              className="mt-3 bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700"
            >
              Mua ngay
            </button>
          ) : (
            <p className="text-sm text-gray-200 mt-3">Sản phẩm tạm hết hàng</p>
          )}
        </div>
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-gray-800 line-clamp-1">
          {product.productName}
        </h3>
        <p className="text-blue-600 font-semibold mt-1">
          {new Intl.NumberFormat("vi-VN").format(product.price)}₫
        </p>
        <div className="flex flex-wrap gap-1 mt-2">
          {product.tags?.length ? (
            product.tags.map((tag) => (
              <span
                key={tag._id || tag.nameTag}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tag.nameTag}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-xs italic">Không có loại</span>
          )}
        </div>
      </div>
    </div>
  );
};

// 🛒 Modal Mua Ngay
const BuyNowModal = ({ product, user, onClose }) => {
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!address.trim()) return alert("Vui lòng nhập địa chỉ giao hàng");
    setLoading(true);
    try {
      await api.post("/orders", {
        buyer: user.id,
        deliveryAddress: address,
        products: [
          {
            product: product._id, // 🔹
            quantity: 1,
            price: product.price,
          },
        ],
        note: note ? [note] : [],
        status: "đang chờ",
      });
      onClose();
    } catch (err) {
      console.error("Lỗi tạo đơn:", err);
       alert("❌ Tạo đơn hàng thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

   return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
        <h2 className="text-lg font-semibold mb-3 text-center">
          Mua ngay: {product.productName}
        </h2>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Nhập địa chỉ giao hàng..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            placeholder="Ghi chú cho người bán (tùy chọn)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-1.5 border rounded-md text-gray-600 hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            disabled={loading}
            onClick={handleConfirm}
            className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Xác nhận đặt hàng"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
