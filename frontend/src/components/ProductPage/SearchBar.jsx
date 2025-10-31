import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";

const SearchBar = ({
  totalCount = 0,
  visibleCount = 0,
  onSearch = () => {},
  onSortChange = () => {},
  loading = false,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState(""); // ✅ rỗng thay vì "default"

  // ⏳ debounce search
  useEffect(() => {
    const delay = setTimeout(() => {
      onSearch(searchValue.trim());
    }, 500);
    return () => clearTimeout(delay);
  }, [searchValue]);

  return (
    <div className="w-full bg-slate-100 shadow-sm rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      {/* Ô tìm kiếm */}
      <div className="relative w-full md:w-1/3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm theo tên..."
          className="w-full pl-9 pr-10 py-2 rounded-lg border border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-300 outline-none transition-all hover:bg-gray-50"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-500" size={18} />
        )}
      </div>

      {/* Thông tin hiển thị */}
      <p className="text-sm text-gray-700">
        Hiển thị{" "}
        <span className="font-medium">{visibleCount}</span> trong tổng số{" "}
        <span className="font-medium">{totalCount}</span> sản phẩm
      </p>

      {/* Dropdown sắp xếp */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Sắp xếp theo:</span>
        <select
          value={sortValue}
          onChange={(e) => {
            setSortValue(e.target.value);
            onSortChange(e.target.value);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 cursor-pointer focus:ring-1 focus:ring-gray-300 focus:border-gray-400 transition-all hover:bg-gray-50"
        >
          <option value="">Mặc định</option> {/* ✅ sửa value */}
          <option value="priceAsc">Giá: thấp → cao</option>
          <option value="priceDesc">Giá: cao → thấp</option>
          <option value="nameAsc">Tên: A–Z</option>
          <option value="nameDesc">Tên: Z–A</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
