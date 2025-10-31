// src/components/ProductPage/Sidebar.jsx
import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import { ChevronDown } from "lucide-react";

const Sidebar = ({ onFilterChange, products = [], filters = {} }) => {
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedSex, setSelectedSex] = useState("");
  const [showTags, setShowTags] = useState(true);
  const [showSex, setShowSex] = useState(true);
  const [showPrice, setShowPrice] = useState(true);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000000);
  const [sliderValue, setSliderValue] = useState(2000000);
  const [filterFromValueUp, setFilterFromValueUp] = useState(false);

  // 🧭 Lấy danh sách Tag
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await api.get("/tags");
        const data =
          res?.data?.data ?? res?.data?.tags ?? (Array.isArray(res?.data) ? res.data : []);
        setTags(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Lỗi khi lấy tags:", err);
        setTags([]);
      }
    };
    fetchTags();
  }, []);

  // 🔁 Reset min/max khi danh sách sản phẩm thay đổi
  useEffect(() => {
    if (products.length === 0) return;
    const prices = products.map((p) => p.price || 0);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    setMinPrice(min);
    setMaxPrice(max);
    setSliderValue(max);
  }, [products]);

  // 🧮 Gửi filter lên cha
  useEffect(() => {
    onFilterChange({
      tagName: selectedTag,
      sex: selectedSex,
      minPrice: filterFromValueUp ? sliderValue : minPrice,
      maxPrice: filterFromValueUp ? maxPrice : sliderValue,
    });
  }, [selectedTag, selectedSex, sliderValue, filterFromValueUp, minPrice, maxPrice, onFilterChange]);

  const formatPrice = (val) =>
    val?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  return (
    <aside className=" fixed  w-64 bg-white shadow-md rounded-lg p-4 space-y-6 overflow-y-auto ">

      

      {/* ----- Lọc theo loại ----- */}
      <div>
        <div
          className="flex items-center justify-between cursor-pointer select-none"
          onClick={() => setShowTags((prev) => !prev)}
        >
          <h2 className="text-lg font-semibold">Loại</h2>
          <ChevronDown
            className={`transform transition-transform duration-300 ${
              showTags ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>

        {showTags && (
          <div className="mt-3 space-y-2">
            {tags.map((tag) => {
              const tagName = tag.nameTag || tag.name;
              const isSelected = selectedTag === tagName;
              return (
                <label
  key={tag._id}
  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all hover:bg-gray-100 ${
    isSelected ? "bg-blue-50" : ""
  }`}
>
  <input
    type="radio"
    name="tag"
    checked={isSelected}
    onChange={() => setSelectedTag(isSelected ? "" : tagName)}
    className="accent-blue-600 cursor-pointer"
  />
  <span className="text-gray-700 cursor-pointer">{tagName}</span>
</label>

              );
            })}

            {tags.length === 0 && (
              <p className="text-sm text-gray-500 italic">Không có tag nào.</p>
            )}
          </div>
        )}
      </div>

      {/* ----- Lọc theo giới tính ----- */}
      <div>
        <div
          className="flex items-center justify-between cursor-pointer select-none"
          onClick={() => setShowSex((prev) => !prev)}
        >
          <h2 className="text-lg font-semibold">Giới tính</h2>
          <ChevronDown
            className={`transform transition-transform duration-300 ${
              showSex ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>

        {showSex && (
          <div className="mt-3 space-y-2">
            {["Nam", "Nữ", "Trẻ em", "Unisex"].map((sex) => {
              const isSelected = selectedSex === sex;
              return (
                <label
  key={sex}
  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all hover:bg-gray-100 ${
    isSelected ? "bg-blue-50" : ""
  }`}
>
  <input
    type="radio"
    name="sex"
    checked={isSelected}
    onChange={() => setSelectedSex(isSelected ? "" : sex)}
    className="accent-blue-600 cursor-pointer"
  />
  <span className="text-gray-700 cursor-pointer">{sex}</span>
</label>

              );
            })}
          </div>
        )}
      </div>

      {/* ----- Lọc theo giá ----- */}
      <div>
        <div
          className="flex items-center justify-between cursor-pointer select-none"
          onClick={() => setShowPrice((prev) => !prev)}
        >
          <h2 className="text-lg font-semibold">Khoảng giá</h2>
          <ChevronDown
            className={`transform transition-transform duration-300 ${
              showPrice ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>

        {showPrice && (
          <div className="mt-4">
            <label className="flex items-center gap-2 mb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filterFromValueUp}
                onChange={(e) => setFilterFromValueUp(e.target.checked)}
                className="accent-blue-600 cursor-pointer"
              />
              <span className="text-sm text-gray-700 cursor-pointer">
                Lọc từ giá hiện tại → cao nhất
              </span>
            </label>

            <div className="relative my-3">
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                step={1000}
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="absolute left-1/2 -translate-x-1/2 top-6 text-sm text-gray-700 font-medium">
                {formatPrice(sliderValue)}
              </div>
            </div>

            <div className="flex justify-between text-sm text-gray-600 mt-8">
              <span>{formatPrice(minPrice)}</span>
              <span>{formatPrice(maxPrice)}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
