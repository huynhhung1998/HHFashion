import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/utils/api";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  User,
  ShoppingCart,
  Search,
  LogOut,
  ChevronDown,
} from "lucide-react";
import Logo from "../../assets/Logo.jpg";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hideTimeout, setHideTimeout] = useState(null);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const searchRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
const [isHoveringSearch, setIsHoveringSearch] = useState(false);
const [hideSearchTimeout, setHideSearchTimeout] = useState(null);
useEffect(() => {
  const delay = setTimeout(async () => {
    if (!searchQuery.trim()) return setSuggestions([]);
    try {
      const res = await api.get(`/products?productName=${encodeURIComponent(searchQuery.trim())}`);
      // lấy tối đa 5 sản phẩm mới nhất
      const sorted = res.data.data?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setSuggestions(sorted.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  }, 300);
  return () => clearTimeout(delay);
}, [searchQuery]);
  // ✅ Load user từ localStorage
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

  // ✅ Navbar tự ẩn/hiện khi di chuột
  useEffect(() => {
    let timeout;
    const handleMouseMove = (e) => {
      if (e.clientY <= 80) setShowNav(true);
      else {
        clearTimeout(timeout);
        timeout = setTimeout(() => setShowNav(false), 1200);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ✅ Scroll làm mờ navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Giỏ hàng
  useEffect(() => {
    const updateCartCount = () => {
      if (user) {
        const cart = JSON.parse(localStorage.getItem(`cart_${user._id}`) || "[]");
        setCartCount(cart.length);
      } else {
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        setCartCount(guestCart.length);
      }
    };
    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, [user]);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("userUpdated"));
    window.dispatchEvent(new Event("cartUpdated"));
    setUser(null);
    setCartCount(0);
    navigate("/login");
  };

  // ✅ Dropdown user
  const handleMouseEnter = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
    setShowDropdown(true);
  };
  const handleMouseLeave = () => {
    const timeout = setTimeout(() => setShowDropdown(false), 1200);
    setHideTimeout(timeout);
  };

  // ✅ Search click
  const toggleSearch = () => {
    setShowSearch((prev) => !prev);
    setTimeout(() => {
      searchRef.current?.focus();
    }, 150);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collection?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
    }
  };

  const getAvatarUrl = () => {
    if (user?.avatar && user.avatar !== "default.jpg") {
      return user.avatar.startsWith("http")
        ? user.avatar
        : `${import.meta.env.VITE_API_URL}/uploads/${user.avatar}`;
    }
    return "https://i.pravatar.cc/40";
  };

  return (
    <nav
      className={`w-full z-50 transition-all duration-500 ${
        isHome
          ? "fixed top-0 bg-white shadow-md"
          : isScrolled
          ? "fixed top-0 bg-white/80 backdrop-blur-md shadow-md"
          : "relative bg-white shadow-sm"
      } ${showNav ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="Logo" className="w-28 h-auto object-contain" />
        </Link>

        {/* Menu Desktop */}
        <ul className="hidden sm:flex gap-6 text-gray-700 text-sm font-medium">
  <NavLink
    to="/"
    className={({ isActive }) =>
      `relative flex flex-col items-center transition-all duration-300 ${
        isActive ? "text-black" : "hover:text-black text-gray-600"
      }`
    }
  >
    Trang Chủ
  </NavLink>

  <NavLink
    to="/products"
    className={({ isActive }) =>
      `relative flex flex-col items-center transition-all duration-300 ${
        isActive ? "text-black" : "hover:text-black text-gray-600"
      }`
    }
  >
    Mua Sắm
  </NavLink>

  <NavLink
    to="/about"
    className={({ isActive }) =>
      `relative flex flex-col items-center transition-all duration-300 ${
        isActive ? "text-black" : "hover:text-black text-gray-600"
      }`
    }
  >
    Thông tin
  </NavLink>

  {/* Liên hệ: scroll xuống footer */}
  <button
    onClick={() => {
      // Nếu đang ở HomePage thì scroll xuống footer
      if (location.pathname === "/") {
        const footer = document.getElementById("footer-section");
        if (footer) {
          footer.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // Nếu không phải home thì điều hướng về home, rồi scroll sau 300ms
        navigate("/");
        setTimeout(() => {
          const footer = document.getElementById("footer-section");
          if (footer) footer.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    }}
    className="relative flex flex-col items-center transition-all duration-300 hover:text-black text-gray-600"
  >
    Liên hệ
  </button>
</ul>


        {/* Right icons */}
        <div className="flex items-center gap-5">
          {/* Search */}
          {/* 🔍 Search với animation */}
<div
  className="relative flex items-center"
  onMouseEnter={() => {
    setIsHoveringSearch(true);
    clearTimeout(hideSearchTimeout);
    setShowSearch(true);
  }}
  onMouseLeave={() => {
    const timeout = setTimeout(() => setShowSearch(false), 1000);
    setHideSearchTimeout(timeout);
    setIsHoveringSearch(false);
  }}
>
  <Search
    className="w-5 h-5 cursor-pointer text-gray-700 hover:text-black"
    onClick={() => {
      setShowSearch(true);
      setIsHoveringSearch(true);
    }}
  />

  {/* Animation input */}
  <AnimatePresence>
    {showSearch && (
      <motion.form
        onSubmit={handleSearch}
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 220, opacity: 1 }}
        exit={{ width: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute right-6 top-0 bg-white shadow-md rounded-full flex items-center pl-3 pr-2 py-1 border border-gray-200 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={searchRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm..."
          className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
        />
        <button type="submit" className="p-1 text-gray-600 hover:text-black">
          <Search className="w-4 h-4" />
        </button>
      </motion.form>
    )}
  </AnimatePresence>

  {/* Gợi ý sản phẩm */}
  <AnimatePresence>
    {showSearch && suggestions.length > 0 && (
      <motion.ul
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute top-8 right-0 w-64 bg-white shadow-lg border border-gray-200 rounded-lg mt-1 z-50"
      >
        {suggestions.map((item) => (
          <li
            key={item._id}
            onClick={() => {
              navigate("/products");
              setShowSearch(false);
              // gửi event mở modal product (ProductList nghe event này)
              window.dispatchEvent(
                new CustomEvent("openProductModal", { detail: item })
              );
            }}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
          >
            <img
              src={item.thumbnail || item.img || "https://via.placeholder.com/50"}
              alt={item.name}
              className="w-10 h-10 object-cover rounded"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-800 line-clamp-1">
                {item.name}
              </span>
              <span className="text-xs text-gray-500">
                {item.price?.toLocaleString()}₫
              </span>
            </div>
          </li>
        ))}
      </motion.ul>
    )}
  </AnimatePresence>
</div>


          {/* User */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {!user ? (
              <User
                className="w-6 h-6 cursor-pointer text-gray-700 hover:text-black"
                onClick={() => navigate("/login")}
              />
            ) : (
              <div className="flex items-center gap-2 cursor-pointer">
                <img
                  src={getAvatarUrl()}
                  alt="avatar"
                  className="w-10 h-10 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">
                  {user.fullname}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            )}

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-3 w-40 bg-white border border-gray-100 rounded-lg shadow-md py-2 text-sm text-gray-600 z-50">
                {!user ? (
                  <>
                    <Link to="/login" className="block px-4 py-2 hover:bg-gray-50">
                      Đăng nhập
                    </Link>
                    <Link to="/signup" className="block px-4 py-2 hover:bg-gray-50">
                      Đăng ký
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/myaccount" className="block px-4 py-2 hover:bg-gray-50">
                      Hồ sơ
                    </Link>
                    <Link to="/cart" className="block px-4 py-2 hover:bg-gray-50">
                      Đơn hàng
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50"
                    >
                      <LogOut className="w-4 h-4 text-gray-500" />
                      Đăng xuất
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <div
            className="relative cursor-pointer"
            onClick={() => (user ? navigate("/cart") : navigate("/login"))}
            title="Giỏ hàng"
          >
            <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-black" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </div>

          {/* Menu Mobile */}
          <div className="sm:hidden">
            <button onClick={() => setVisible(true)}>
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Mobile */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 transition-all duration-500 ease-in-out ${
          visible ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <p className="text-lg font-semibold">Menu</p>
          <X onClick={() => setVisible(false)} className="w-6 h-6 cursor-pointer" />
        </div>
        <div className="flex flex-col text-gray-600">
          {["/", "/collection", "/about", "/contact"].map((path, i) => (
            <NavLink
              key={path}
              onClick={() => setVisible(false)}
              to={path}
              className="py-3 px-6 border-b hover:bg-gray-50"
            >
              {["HOME", "COLLECTION", "ABOUT", "CONTACT"][i]}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
