// src/components/HomePage/NewProducts.jsx
import React, { useEffect, useState } from "react";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import api from "@/utils/api";
import { useNavigate } from "react-router-dom";
import ProductDetailModal from "@/components/ProductPage/ProductDetailModal";


// --- Định dạng giá tiền ---
const formatPrice = (price) =>
  price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";

// --- Hàm chọn ngẫu nhiên N phần tử trong mảng ---
const getRandomProducts = (arr, count) => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
};

const NewProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [likedProducts, setLikedProducts] = useState(new Set());
  const navigate = useNavigate();

  // 🧠 Lấy user từ localStorage
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

  // ✅ Fetch tất cả sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products/all");
        const data = res.data.data || res.data;
        const random12 = getRandomProducts(data, 12);
        setProducts(random12);
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm:", err);
      }
    };
    fetchProducts();
  }, []);

  // --- Xử lý animation fly-to-cart ---
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
    flyImg.style.transition =
      "all 0.6s cubic-bezier(0.55, 0.06, 0.68, 0.19)";
    document.body.appendChild(flyImg);

    // Vị trí giỏ hàng ở góc phải trên
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

  // --- Xử lý thêm giỏ hàng ---
  const handleAddToCart = async (product, e) => {
    // dừng bubble sớm
    e.stopPropagation();

    if (!user?.id) {
      navigate("/login");
      return;
    }

    // --- LẤY VỊ TRÍ NGAY LẬP TỨC trước khi await (fix lỗi event null) ---
    let startLeft = 0;
    let startTop = 0;
    try {
      const rect = e.currentTarget.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;
    } catch (err) {
      // fallback: trung tâm màn hình nếu không lấy được
      startLeft = window.innerWidth / 2;
      startTop = window.innerHeight / 2;
    }

    try {
      // gọi API thêm vào cart
      await api.post(`/carts/${user.id}`, { productId: product._id, quantity: 1 });

      // tạo hiệu ứng bay lên dùng tọa độ đã lưu
      createFlyAnimation(product.img?.[0] || "/fallback.jpg", startLeft, startTop);
    } catch (err) {
      console.error("Lỗi thêm vào giỏ hàng:", err);
    }
  };

  // --- Xử lý mở modal xem chi tiết ---
  const handleView = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // --- Xử lý thêm vào wishlist ---
  const handleLike = async (product, e) => {
    e.stopPropagation();

    if (!user?.id) {
      navigate("/login");
      return;
    }

    try {
      await api.post("/wishlist/add", {
        userId: user.id,
        productId: product._id,
      });

      // Cập nhật trạng thái liked
      setLikedProducts((prev) => {
        const updated = new Set(prev);
        if (updated.has(product._id)) updated.delete(product._id);
        else updated.add(product._id);
        return updated;
      });
    } catch (err) {
      console.error("Lỗi thêm vào wishlist:", err);
    }
  };

  // --- Chuyển đến trang tất cả sản phẩm ---
  const handleViewMore = () => {
    navigate("/products");
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Thanh tiêu đề */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">
          Sản phẩm mới
        </h2>
        <button
          onClick={handleViewMore}
          className="text-gray-600 hover:text-black text-sm font-medium transition"
        >
          Xem thêm
        </button>
      </div>

      {/* Lưới sản phẩm */}
      <div
        className="
          grid gap-6
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-6
          max-w-[1600px] mx-auto
        "
      >
        {products.map((product) => {
          const randomImg =
            product.img?.[Math.floor(Math.random() * product.img.length)] ||
            "/fallback.jpg";

          const isLiked = likedProducts.has(product._id);

          return (
            <div
              key={product._id}
              className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Hình ảnh */}
              <div
                className="relative aspect-[3/4] overflow-hidden cursor-pointer"
                onClick={() => handleView(product)}
              >
                <img
                  src={randomImg}
                  alt={product.productName}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-[30%]"
                />

                {/* Icon hover */}
                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="p-2 bg-white/40 backdrop-blur-sm rounded-full shadow hover:bg-white/60 transition"
                    title="Thêm vào giỏ"
                  >
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleView(product);
                    }}
                    className="p-2 bg-white/40 backdrop-blur-sm rounded-full shadow hover:bg-white/60 transition"
                    title="Xem sản phẩm"
                  >
                    <Eye className="w-5 h-5 text-white" />
                  </button>

                  <button
                    onClick={(e) => handleLike(product, e)}
                    className={`p-2 backdrop-blur-sm rounded-full shadow transition ${
                      isLiked
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-white/40 hover:bg-white/60"
                    }`}
                    title="Yêu thích"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isLiked ? "text-white fill-white" : "text-white"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Tên và giá */}
              <div className="p-3">
                <h3 className="text-sm text-gray-800 line-clamp-2 leading-snug">
                  {product.productName}
                </h3>
                <p className="text-black-600 font-semibold text-base mt-1 text-right">
                  {formatPrice(product.price)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal chi tiết sản phẩm */}
      {isModalOpen && selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default NewProducts;
