import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Diamond,
  Star,
  DollarSign,
  BadgeCheck,
  Sparkles,
  ShoppingCart,
  ChevronRight,
} from "lucide-react";

import Bg1 from "../../assets/Bg1.jpg";
import Bg2 from "../../assets/Bg2.jpg";
import Bg3 from "../../assets/Bg3.jpg";
import Bg4 from "../../assets/Bg4.jpg";

const backgroundImages = [Bg1, Bg2, Bg3, Bg4];
const textSlides = [
  {
    top: "Phong cách",
    bottom: "Sang Trọng",
    icon: <Diamond className="inline-block ml-2 text-pink-200 animate-pulse" />,
  },
  {
    top: "Thể Hiện",
    bottom: "Đẳng Cấp",
    icon: <Star className="inline-block ml-2 text-yellow-300 animate-pulse" />,
  },
  {
    top: "Giá Cả",
    bottom: "Ưu Đãi",
    icon: (
      <DollarSign className="inline-block ml-2 text-green-300 animate-pulse" />
    ),
  },
  {
    top: "Thần Thái",
    bottom: "Lịch Lãm",
    icon: (
      <BadgeCheck className="inline-block ml-2 text-blue-300 animate-pulse" />
    ),
  },
  {
    top: "Thời Trang",
    bottom: "Quý Phái",
    icon: (
      <Sparkles className="inline-block ml-2 text-rose-300 animate-pulse" />
    ),
  },
  {
    top: "",
    bottom: "Mua sắm ngay",
    icon: (
      <ShoppingCart className="inline-block ml-3 text-pink-200 animate-pulse" />
    ),
  },
];

const Hero = () => {
  const [bgIndex, setBgIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);
  const totalImages = backgroundImages.length;
const navigate = useNavigate();
  // Auto change background image
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setBgIndex((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, []);

  // Reset transition when loop back (4 → 1)
  useEffect(() => {
    if (bgIndex === totalImages) {
      setTimeout(() => {
        sliderRef.current.style.transition = "none";
        setBgIndex(0);
        requestAnimationFrame(() => {
          sliderRef.current.style.transition =
            "transform 1.5s ease-in-out";
        });
      }, 1500); // chờ slide xong rồi reset
    }
  }, [bgIndex, totalImages]);

  // Text slide auto
  useEffect(() => {
    const textTimer = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % textSlides.length);
    }, 4000);
    return () => clearInterval(textTimer);
  }, []);

  return (
    <section className="relative w-full h-[100vh] overflow-hidden bg-black">
      {/* ===== Background carousel giữ tỷ lệ đẹp ===== */}
      <div className="relative overflow-hidden w-full h-[100vh] bg-white">
        <div
          ref={sliderRef}
          className="flex transition-transform duration-[4000ms] ease-in-out"
          style={{
            transform: `translateX(-${bgIndex * 100}%)`,
          }}
        >
          {[...backgroundImages, backgroundImages[0]].map((img, i) => (
            <div
              key={i}
              className="min-w-full h-[100vh] flex items-center justify-center bg-white"
            >
              <img
                src={img}
                alt={`slide-${i}`}
                className="w-full h-full object-cover object-center transition-all duration-3000"
                loading="lazy"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
      </div>

      {/* ===== Overlay mờ nhẹ ===== */}
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent"></div>

      {/* ===== Text animation ===== */}
      <div className="absolute inset-0 flex flex-col justify-center items-start pl-8 md:pl-24 text-white z-10 overflow-hidden">
        <div
          key={textIndex}
          className="animate-textSlideIn opacity-0 transition-all duration-1000"
        >
          {textSlides[textIndex].top && (
            <h3 className="text-3xl md:text-5xl font-medium tracking-wide mb-3 opacity-90">
              {textSlides[textIndex].top}
            </h3>
          )}
          <h1 className="text-6xl md:text-9xl font-extrabold flex items-center gap-4 leading-tight drop-shadow-[3px_3px_8px_rgba(0,0,0,0.5)]">
            {textSlides[textIndex].bottom} {textSlides[textIndex].icon}
            <button
  onClick={() => navigate("/products")}
  className="ml-4 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full border border-white/40 bg-white/20 hover:bg-white/40 transition"
>
  <ChevronRight className="text-white/80 md:w-8 md:h-8" />
</button>
          </h1>
        </div>
      </div>

      {/* ===== Custom text animation ===== */}
      <style>{`
        @keyframes textSlideIn {
          0% {
            opacity: 0;
            transform: translateX(-60px);
          }
          15% {
            opacity: 1;
            transform: translateX(0);
          }
          75% {
            opacity: 1;
            transform: translateX(0);
          }
          100% {
            opacity: 0;
            transform: translateX(200px);
          }
        }
        .animate-textSlideIn {
          animation: textSlideIn 4s ease-in-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Hero;
