// src/components/ProductPage/ProductDetailModal.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  X,
  Heart,
  Share2,
  Facebook,
  Mail,
  Phone,
  Star,
  Minus,
  Plus,
  ShoppingCart,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import api from "@/utils/api"; // giả định axios instance
import useToast from "@/hooks/useToast";

/**
 * ProductDetailModal - sửa để wishlist hoạt động ổn định
 */

const resolveImageUrl = (url) => {
  if (!url) return "/placeholder.jpg";
  if (url.startsWith("http") || url.startsWith("data:image")) return url;
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  return `${BASE_URL}/${url.replace(/^\/+/, "")}`;
};

const BadgeStatus = ({ quantity }) => {
  let text = "Còn hàng";
  let cls = "bg-green-500";
  if (quantity <= 0) {
    text = "Hết hàng";
    cls = "bg-red-500";
  } else if (quantity <= 5) {
    text = "Sắp hết";
    cls = "bg-yellow-500";
  }
  return (
    <span className={`text-white text-xs font-semibold px-2 py-1 rounded-full ${cls}`}>
      {text}
    </span>
  );
};

const RandomBadge = () => {
  const list = [
    { text: "Hot", color: "bg-red-500" },
    { text: "Best Seller", color: "bg-orange-500" },
    { text: "Chính Hãng", color: "bg-blue-600" },
  ];
  const pick = list[Math.floor(Math.random() * list.length)];
  return (
    <span className={`text-white text-xs font-semibold px-2 py-1 rounded ${pick.color}`}>
      {pick.text}
    </span>
  );
};

export default function ProductDetailModal({ product, onClose }) {
  const imgs =
    Array.isArray(product.img) && product.img.length
      ? product.img
      : [product.img || "/placeholder.jpg"];

  const [mainIndex, setMainIndex] = useState(0);
  const [thumbPage, setThumbPage] = useState(0);
  const THUMB_PAGE_SIZE = 4;
  const thumbPages = Math.max(1, Math.ceil(imgs.length / THUMB_PAGE_SIZE));

  // zoom & drag
  const [zoom, setZoom] = useState(1); // 1 or 3
  const imgWrapperRef = useRef(null);
  const imgRef = useRef(null);
  const dragging = useRef(false);
  const start = useRef({ x: 0, y: 0 });
  const translate = useRef({ x: 0, y: 0 });

  // qty & UI
  const [qty, setQty] = useState(product.quantity > 0 ? 1 : 0);
  const maxQty = Math.max(0, product.quantity ?? 0);

  // random rating and reviews on open
  const [rating, setRating] = useState(4.8);
  const [reviews, setReviews] = useState(356);

  // user & wishlist states
  const [user, setUser] = useState(null);
  const [liked, setLiked] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  // fly-to-cart ref
  const flyingRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    const r = Math.random() < 0.5 ? 4 + Math.random() * 0.9 : 4.5 + Math.random() * 0.5;
    setRating(Math.round(r * 10) / 10);
    setReviews(200 + Math.floor(Math.random() * 1801));
    setZoom(1);
    translate.current = { x: 0, y: 0 };
    if (imgRef.current) imgRef.current.style.transform = `translate(0px,0px) scale(1)`;
    setMainIndex(0);
    setThumbPage(0);
    setQty(product.quantity > 0 ? 1 : 0);

    // Load user from localStorage synchronously (avoid relying on async setState before using)
    let currentUser = null;
    try {
      const raw = localStorage.getItem("user");
      currentUser = raw ? JSON.parse(raw) : null;
      setUser(currentUser);
    } catch {
      currentUser = null;
      setUser(null);
    }

    // check wishlist status if logged in
    (async () => {
      if (!currentUser?.id) {
        setLiked(false);
        return;
      }
      try {
        setWishlistLoading(true);
        const res = await api.get(`/wishlist/${currentUser.id}`);
        // Normalize response to an array of items (many APIs return { wishlist: {...items: [...] } } or data or array)
        let rawList = [];
        if (res?.data?.wishlist && Array.isArray(res.data.wishlist.items)) {
          rawList = res.data.wishlist.items;
        } else if (Array.isArray(res?.data?.data)) {
          rawList = res.data.data;
        } else if (Array.isArray(res?.data)) {
          rawList = res.data;
        } else if (Array.isArray(res?.data?.wishlist)) {
          rawList = res.data.wishlist;
        } else if (res?.data?.items && Array.isArray(res.data.items)) {
          rawList = res.data.items;
        }

        // Map to product IDs to compare robustly
        const productIds = rawList
          .map((it) => {
            if (!it) return null;
            // item might be { product: { id or _id } } or it could be the product id string directly
            const p = it.product || it;
            return p && (p.id || p._id || p) ? String(p.id || p._id || p) : null;
          })
          .filter(Boolean);

        const prodId = String(product.id ?? product._id ?? product);
        const found = productIds.includes(prodId);
        setLiked(Boolean(found));
      } catch (err) {
        console.warn("Could not fetch wishlist", err);
        setLiked(false);
      } finally {
        setWishlistLoading(false);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  // drag handlers (mouse / touch)
  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      e.preventDefault();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const dx = clientX - start.current.x;
      const dy = clientY - start.current.y;
      translate.current = { x: translate.current.x + dx, y: translate.current.y + dy };
      start.current = { x: clientX, y: clientY };
      applyTransform();
    };
    const onUp = () => {
      dragging.current = false;
      if (imgWrapperRef.current) imgWrapperRef.current.style.cursor = "grab";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  const applyTransform = () => {
    if (!imgRef.current) return;
    imgRef.current.style.transform = `translate(${translate.current.x}px, ${translate.current.y}px) scale(${zoom})`;
  };

  const handleZoomToggle = (e) => {
    e.stopPropagation();
    if (zoom === 1) {
      setZoom(3);
      if (imgWrapperRef.current) imgWrapperRef.current.style.cursor = "grab";
      translate.current = { x: 0, y: 0 };
      requestAnimationFrame(() => applyTransform());
    } else {
      setZoom(1);
      translate.current = { x: 0, y: 0 };
      if (imgRef.current) imgRef.current.style.transform = `translate(0px, 0px) scale(1)`;
      if (imgWrapperRef.current) imgWrapperRef.current.style.cursor = "default";
    }
  };

  const onMouseDown = (e) => {
    if (zoom === 1) return;
    dragging.current = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    start.current = { x: clientX, y: clientY };
    if (imgWrapperRef.current) imgWrapperRef.current.style.cursor = "grabbing";
  };

  const visibleThumbs = imgs.slice(thumbPage * THUMB_PAGE_SIZE, thumbPage * THUMB_PAGE_SIZE + THUMB_PAGE_SIZE);

  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(fbUrl, "_blank");
      toast.info("Link đã được sao chép và mở Facebook share.");
    } catch (err) {
      console.warn("Share failed", err);
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank");
    }
  };

  const dec = () => setQty((p) => Math.max(0, p - 1));
  const inc = () => setQty((p) => Math.min(maxQty, p + 1));

  // ---------- ACTIONS: buy now, add to cart, wishlist ----------
 const handleBuyNow = async () => {
  if (!user?.id) {
    toast.warning("Vui lòng đăng nhập", "Bạn cần đăng nhập để mua hàng.");
    return;
  }

  if (maxQty === 0) {
    await toggleWishlist();
    return;
  }

  // 👉 Mở modal nhập địa chỉ và ghi chú (giống Cart.jsx)
  setShowBuyModal(true);
};

const confirmBuyNow = async () => {
  try {
    setLoading(true);
    const orderPayload = {
      buyer: user.id,
      deliveryAddress: address,
      note: note ? [note] : [],
      products: [
        {
          product: product.id,
          quantity: qty,
          price: product.price,
        },
      ],
      totalPrice: (product.price || 0) * qty,
      status: "đang chờ",
    };
    const res = await api.post("/orders", orderPayload);
    if (res?.data) {
      toast.success("Đặt hàng thành công", "Đơn hàng đã được tạo.");
      setShowBuyModal(false);
      setAddress("");
      setNote("");
    }
  } catch (err) {
    console.error("Buy error", err);
    toast.error("Lỗi khi đặt hàng", "Vui lòng thử lại.");
  } finally {
    setLoading(false);
  }
};



  const createFlyingImage = (src, startRect, endRect) => {
    const img = document.createElement("img");
    img.src = src;
    img.style.position = "fixed";
    img.style.left = `${startRect.left}px`;
    img.style.top = `${startRect.top}px`;
    img.style.width = `${startRect.width}px`;
    img.style.height = `${startRect.height}px`;
    img.style.transition = "transform 700ms cubic-bezier(.2,.8,.2,1), opacity 700ms";
    img.style.zIndex = 9999;
    img.style.borderRadius = "8px";
    document.body.appendChild(img);

    // compute translate and scale
    const dx = endRect.left + endRect.width / 2 - (startRect.left + startRect.width / 2);
    const dy = endRect.top + endRect.height / 2 - (startRect.top + startRect.height / 2);
    const scaleX = endRect.width / startRect.width;
    const scaleY = endRect.height / startRect.height;
    const scale = Math.max(scaleX, scaleY) * 0.6; // shrink a bit

    requestAnimationFrame(() => {
      img.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
      img.style.opacity = "0.3";
    });

    setTimeout(() => {
      img.remove();
    }, 750);
  };

  const handleAddToCart = async () => {
    if (!user?.id) {
      toast.warning("Vui lòng đăng nhập", "Bạn cần đăng nhập để thêm vào giỏ.");
      return;
    }
    if (qty <= 0) {
      toast.warning("Số lượng không hợp lệ", "Vui lòng chọn số lượng > 0.");
      return;
    }

    try {
      // attempt to create flying image
      try {
        const thumb = imgRef.current;
        const cartIcon = document.querySelector("#global-cart-icon") || document.querySelector(".global-cart") || null;
        if (thumb && cartIcon) {
          const startRect = thumb.getBoundingClientRect();
          const endRect = cartIcon.getBoundingClientRect();
          createFlyingImage(resolveImageUrl(imgs[mainIndex]), startRect, endRect);
        }
      } catch (err) {
        // ignore fly effect errors
      }

      const payload = {
        productId: product.id,
        quantity: qty,
        price: product.price,
      };
      const res = await api.post(`/carts/${user.id}`, payload);
      if (res?.data) {
        toast.success("Đã thêm vào giỏ hàng", "Bạn có thể tiếp tục mua sắm.");
      } else {
        toast.error("Thêm giỏ thất bại", "Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Add to cart error", err);
      toast.error("Lỗi thêm giỏ", "Vui lòng thử lại.");
    }
  };

  const toggleWishlist = async () => {
    // read fresh user in case it changed
    let currentUser = user;
    if (!currentUser?.id) {
      try {
        const raw = localStorage.getItem("user");
        currentUser = raw ? JSON.parse(raw) : null;
      } catch {
        currentUser = null;
      }
    }

    if (!currentUser?.id) {
      toast.warning("Vui lòng đăng nhập", "Bạn cần đăng nhập để quản lý yêu thích.");
      return;
    }

    try {
      setWishlistLoading(true);
      if (!liked) {
        // add
        // API in project: POST /wishlist/:userId  { productId }
        const res = await api.post(`/wishlist/${currentUser.id}`, { productId: product.id });
        // assume success status (200/201)
        setLiked(true);
        toast.success("Đã thêm vào danh sách yêu thích!");
      } else {
        // remove
        // API in project: DELETE /wishlist/remove/:userId/:productId
        const res = await api.delete(`/wishlist/remove/${currentUser.id}/${product.id}`);
        setLiked(false);
        toast.info("Đã xóa khỏi danh sách yêu thích!");
      }

      // notify other components to refresh wishlist
      try {
        // update a timestamp in localStorage (useful across tabs)
        localStorage.setItem("wishlist_ts", String(Date.now()));
        // dispatch custom event for same-tab listeners
        window.dispatchEvent(new CustomEvent("wishlistChanged", { detail: { productId: product.id, liked: !liked } }));
      } catch (e) {
        // ignore
      }
    } catch (err) {
      console.error("Wishlist error", err);
      toast.error("Thao tác yêu thích thất bại", "Vui lòng thử lại sau.");
    } finally {
      setWishlistLoading(false);
    }
  };

  // small helper for truncated description (3 lines)
  const shortDesc = product.description ? product.description.split("\n").join(" ") : "Không có mô tả";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-auto bg-black/50 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl max-w-5xl w-full shadow-2xl overflow-hidden mx-2 sm:mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b">
          <div className="text-xs text-gray-600 truncate">
            <a href="/" className="hover:underline">Trang chủ</a>
            <span className="mx-2 text-gray-300">›</span>
            <a href="/products" className="hover:underline">Sản phẩm</a>
            <span className="mx-2 text-gray-300">›</span>
            <span className="text-gray-800">{product.productName}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                // share quick
                handleShare();
              }}
              className="hidden sm:inline-flex items-center gap-2 text-gray-600 px-2 py-1 rounded hover:bg-gray-100"
              title="Chia sẻ"
            >
              <Share2 size={16} />
            </button>
            <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: images */}
          <div className="space-y-3">
            <div className="relative bg-gray-50 rounded-lg overflow-hidden">
              <div className="absolute top-4 left-4 z-20">
                <BadgeStatus quantity={product.quantity ?? 0} />
              </div>

              <button
                onClick={handleZoomToggle}
                className="absolute top-4 right-4 z-20 bg-white rounded-full p-2 shadow-sm hover:shadow-md"
                title={zoom === 1 ? "Phóng to" : "Thu nhỏ"}
              >
                {zoom === 1 ? <ZoomIn size={18} /> : <ZoomOut size={18} />}
              </button>

              <div
                ref={imgWrapperRef}
                className="w-full h-[320px] sm:h-[420px] flex items-center justify-center bg-white"
                onMouseDown={onMouseDown}
                onTouchStart={onMouseDown}
                onClick={(e) => {
                  if (zoom === 1) e.stopPropagation();
                }}
                style={{ cursor: zoom === 1 ? "default" : "grab" }}
              >
                <img
                  ref={imgRef}
                  src={resolveImageUrl(imgs[mainIndex])}
                  alt={product.productName}
                  className="max-h-full max-w-full object-contain transition-transform duration-150"
                  style={{ transform: `translate(${translate.current.x}px, ${translate.current.y}px) scale(${zoom})` }}
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>

              {/* thumbnails */}
              <div className="px-3 py-2 bg-white border-t flex items-center gap-3">
                <button
                  onClick={() => setThumbPage((p) => Math.max(0, p - 1))}
                  disabled={thumbPage === 0}
                  className={`p-2 rounded border ${thumbPage === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}`}
                >
                  ‹
                </button>

                <div className="flex gap-3 overflow-hidden">
                  {visibleThumbs.map((t, idx) => {
                    const realIdx = thumbPage * THUMB_PAGE_SIZE + idx;
                    return (
                      <button
                        key={realIdx}
                        onClick={() => {
                          setMainIndex(realIdx);
                          setZoom(1);
                          translate.current = { x: 0, y: 0 };
                        }}
                        className={`w-[64px] h-[48px] rounded border overflow-hidden ${realIdx === mainIndex ? "ring-2 ring-blue-500" : ""}`}
                      >
                        <img src={resolveImageUrl(t)} alt={`thumb-${realIdx}`} className="w-full h-full object-cover" />
                      </button>
                    );
                  })}
                </div>

                <div className="flex-1 flex justify-end">
                  <button
                    onClick={() => setThumbPage((p) => Math.min(thumbPages - 1, p + 1))}
                    disabled={thumbPage >= thumbPages - 1}
                    className={`p-2 rounded border ${thumbPage >= thumbPages - 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}`}
                  >
                    ›
                  </button>
                </div>
              </div>

              {/* actions below thumbnails */}
              <div className="px-3 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleWishlist}
                    disabled={wishlistLoading}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${liked ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    title={liked ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
                  >
                    <Heart size={16} className={`${liked ? "text-red-600" : "text-gray-600"}`} />
                    <span className="text-sm">{liked ? "Yêu thích" : "Yêu thích"}</span>
                  </button>

                  <div className="hidden sm:flex items-center gap-2">
                    <a href="https://fb.com/vuhung.boy" target="_blank" rel="noreferrer" className="p-2 rounded hover:bg-gray-100">
                      <Facebook size={18} />
                    </a>
                    <a href="mailto:vuhung.boy@gmail.com" className="p-2 rounded hover:bg-gray-100">
                      <Mail size={18} />
                    </a>
                    <a href="tel:0793656522" className="p-2 rounded hover:bg-gray-100">
                      <Phone size={18} />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={handleShare} className="px-2 py-1 rounded hover:bg-gray-100 text-sm">Chia sẻ</button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: details */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">{product.productName}</h2>
              <div className="flex items-center gap-2">
                <RandomBadge />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">{rating} ({reviews} đánh giá)</span>
              </div>
              <div className="ml-auto">
                <BadgeStatus quantity={product.quantity ?? 0} />
              </div>
            </div>

            <div className="flex items-end gap-4">
              <div className="text-2xl sm:text-3xl text-red-600 font-bold">
                {new Intl.NumberFormat("vi-VN").format(product.price ?? 0)}₫
              </div>
              {product.originalPrice && <div className="text-sm line-through text-gray-400">{new Intl.NumberFormat("vi-VN").format(product.originalPrice)}₫</div>}
            </div>

            <p className="text-gray-600 text-sm line-clamp-3">{shortDesc}</p>

            <div>
              <div className="text-sm text-gray-500 mb-2">Loại:</div>
              <div className="flex gap-2 flex-wrap">
                {(product.tags && product.tags.length) ? product.tags.map((t) => (
                  <span key={t._id || t.nameTag} className="px-3 py-1 rounded border text-sm text-gray-600">
                    {t.nameTag}
                  </span>
                )) : <span className="px-3 py-1 rounded border text-sm text-gray-400">Không có tag</span>}
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <strong>Thời Trang</strong> {product.sex ? ` ${product.sex}` : ""}
            </div>

            <div className="flex items-center gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Số lượng:</div>
                <div className="inline-flex items-center border rounded-md overflow-hidden">
                  <button onClick={dec} className="p-2 hover:bg-gray-100"><Minus size={16} /></button>
                  <div className="px-4 py-2 min-w-[48px] text-center">{qty}</div>
                  <button onClick={inc} className="p-2 hover:bg-gray-100"><Plus size={16} /></button>
                </div>
                <div className="text-xs text-gray-400 mt-1">(Tối đa {maxQty} sản phẩm)</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                onClick={handleBuyNow}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white ${maxQty === 0 ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {maxQty === 0 ? <Heart size={18} /> : <ShoppingCart size={18} />}
                <span className="font-medium">{maxQty === 0 ? "Yêu thích" : "Mua ngay"}</span>
              </button>

              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <ShoppingCart size={18} />
                <span className="font-medium">Thêm vào giỏ hàng</span>
              </button>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-lg font-medium mb-2">Mô tả sản phẩm</h3>
              <div className="text-sm text-gray-700 whitespace-pre-line max-h-56 overflow-auto pr-2">
                {product.longDescription || product.description || "Không có mô tả chi tiết."}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t text-right">
          <button onClick={onClose} className="px-4 py-2 rounded hover:bg-gray-100">Đóng</button>
        </div>
      </div>
      {/* 🧾 Modal xác nhận mua */}
{showBuyModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[70]">
    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
      <h2 className="text-lg font-semibold mb-4">Xác nhận mua hàng</h2>

      <label className="block text-sm text-gray-700 mb-1">Địa chỉ giao hàng</label>
      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Nhập địa chỉ giao hàng..."
        className="w-full border rounded px-3 py-2 mb-3 focus:outline-none focus:ring"
      />

      <label className="block text-sm text-gray-700 mb-1">Ghi chú (nếu có)</label>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Ghi chú cho đơn hàng..."
        className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring"
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowBuyModal(false)}
          className="px-4 py-2 rounded border hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          onClick={confirmBuyNow}
          disabled={loading || !address.trim()}
          className={`px-4 py-2 rounded text-white ${
            loading || !address.trim()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Đang xử lý..." : "Xác nhận"}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
    
  );
}
