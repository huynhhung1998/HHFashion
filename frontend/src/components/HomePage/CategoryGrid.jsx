import React, { useEffect, useState, useRef } from "react";
import api from "@/utils/api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
const CategoryGrid = () => {
  const [tags, setTags] = useState([]);
  const [products, setProducts] = useState([]);
  const [displayTags, setDisplayTags] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [fadeImage, setFadeImage] = useState(false);
  const [direction, setDirection] = useState(null); // "left" | "right"
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tagRes, productRes] = await Promise.all([
          api.get("/tags"),
          api.get("/products"),
        ]);
        const tagData = tagRes.data.data || tagRes.data;
        const productData = productRes.data.data || productRes.data;
        setTags(tagData);
        setProducts(productData);

        if (tagData.length >= 3) {
          const initialTags = getRandomUnique(tagData, 3);
          setDisplayTags(initialTags);
        }
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      }
    };
    fetchData();
  }, []);

  const navigate = useNavigate();
const handleTagClick = (tag) => {
  navigate(`/products?tag=${tag._id}`);
};

  // Random unique tags
  const getRandomUnique = (arr, count) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, arr.length));
  };

  // Random image by tagId
  const getRandomImageByTag = (tagId) => {
    const filtered = products.filter((p) =>
      p.tags?.some(
        (t) => (t._id ? t._id.toString() : t.toString()) === tagId.toString()
      )
    );
    if (filtered.length === 0) return null;
    const randomProduct =
      filtered[Math.floor(Math.random() * filtered.length)];
    const imgs = randomProduct.img || [];
    return imgs.length > 0
      ? imgs[Math.floor(Math.random() * imgs.length)]
      : null;
  };

  // Auto change every 6s
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      handleSlide("right", true);
    }, 6000);
    return () => clearInterval(intervalRef.current);
  }, [tags, displayTags]);

  const handleSlide = (dir, auto = false) => {
  if (animating || tags.length < 3) return;
  setAnimating(true);
  setDirection(dir);

  setTimeout(() => {
    // Lọc bỏ các tag đang hiển thị
    const remaining = tags.filter(
      (t) => !displayTags.some((d) => d._id === t._id)
    );
    // Nếu tất cả đã hiển thị thì random từ toàn bộ (đề phòng trường hợp < 4 tag)
    const pool = remaining.length > 0 ? remaining : tags;
    const newTag = getRandomUnique(pool, 1)[0];

    let updated;
    if (dir === "right") {
      updated = [...displayTags.slice(1), newTag];
    } else {
      updated = [newTag, ...displayTags.slice(0, 2)];
    }

    setDisplayTags(updated);
    setAnimating(false);

    // Reset auto timer khi bấm tay
    if (!auto) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        handleSlide("right", true);
      }, 6000);
    }
  }, 600);
};


  // Card hover style
  const getCardStyle = (index) => {
    if (hoveredIndex === null) return {};
    if (hoveredIndex === index)
      return {
        transform: "scale(1.5)",
        zIndex: 20,
        boxShadow: "0 0 25px 5px rgba(255,255,255,0.6)",
        opacity: 1,
        transition: "all 0.5s ease",
      };
    if (hoveredIndex < index)
      return { transform: "translateX(25px)", opacity: 0.7 };
    return { transform: "translateX(-25px)", opacity: 0.7 };
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-10 ">
      {/* Nút điều hướng */}
      <button
        onClick={() => handleSlide("left")}
        className="absolute left-[6%] top-1/2 -translate-y-1/2 z-30 opacity-40 hover:opacity-80 transition"
      >
        <ChevronLeft size={38} className="text-white" />
      </button>

      <button
        onClick={() => handleSlide("right")}
        className="absolute right-[6%] top-1/2 -translate-y-1/2 z-30 opacity-40 hover:opacity-80 transition"
      >
        <ChevronRight size={38} className="text-white" />
      </button>

      {/* Cards */}
      <div
        className={`flex gap-6 items-center justify-center relative transition-all duration-700 ease-in-out ${
          animating ? (direction === "left" ? "slide-left" : "slide-right") : ""
        } opacity-50 hover:opacity-100`}
      >
        {displayTags.map((tag, index) => {
          const imageUrl = getRandomImageByTag(tag._id);
          return (
            <div
  key={tag._id}
  className={`relative rounded-2xl overflow-hidden cursor-pointer flex-shrink-0 transition-all duration-700 ease-out card-item`}
  style={{
    width: "clamp(260px, 30vw, 420px)",
    height: "clamp(180px, 25vw, 260px)",
    backgroundColor: "#111",
    ...getCardStyle(index),
  }}
  onMouseEnter={() => setHoveredIndex(index)}
  onMouseLeave={() => setHoveredIndex(null)}
  onClick={() => handleTagClick(tag)} // 👈 thêm dòng này
>

              {/* Background Image */}
              <div
                className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${
                  fadeImage ? "opacity-0" : "opacity-100"
                }`}
                style={{
                  backgroundImage: imageUrl
                    ? `url(${imageUrl})`
                    : "linear-gradient(45deg, #333, #555)",
                  filter:
                    hoveredIndex === index
                      ? "brightness(0.5)"
                      : "brightness(0.8)",
                }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 z-10 transition-opacity duration-500" />
              {/* Tag name */}
              <div
                className={`absolute text-white font-semibold text-center z-20 transition-all duration-700 ease-out
          ${
            hoveredIndex === index
              ? "text-5xl drop-shadow-[0_0_25px_rgba(255,255,255,0.9)] bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 "
              : "text-3xl drop-shadow-lg bottom-4 left-1/2 -translate-x-1/2"
          }`}
              >
                {tag.nameTag}
              </div>
            </div>
          );
        })}
      </div>

      {/* CSS animation */}
      <style>{`
        .slide-right .card-item {
          animation: slideRight 0.6s ease-in-out forwards;
        }
        .slide-left .card-item {
          animation: slideLeft 0.6s ease-in-out forwards;
        }

        @keyframes slideRight {
          0% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
          30% {
            opacity: 0.6;
          }
          50% {
            transform: translateX(-33%) scale(0.9);
            opacity: 0.3;
          }
          100% {
            transform: translateX(-100%) scale(0.8);
            opacity: 0;
          }
        }
        @keyframes slideLeft {
          0% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
          30% {
            opacity: 0.6;
          }
          50% {
            transform: translateX(33%) scale(0.9);
            opacity: 0.3;
          }
          100% {
            transform: translateX(100%) scale(0.8);
            opacity: 0;
          }
        }

        @media (max-width: 1024px) {
          .flex > div {
            width: clamp(220px, 45vw, 350px);
          }
        }
        @media (max-width: 640px) {
          .flex > div {
            width: 80vw;
          }
        }
      `}</style>
    </div>
  );
};

export default CategoryGrid;
