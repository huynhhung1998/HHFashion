import { useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/HomePage/Navbar";
import Sidebar from "../components/ProductPage/SideBar";
import ProductList from "../components/ProductPage/ProductList";
import SearchBar from "../components/ProductPage/SearchBar";

const ProductPage = () => {
  const [filters, setFilters] = useState({
    tagName: "",
    sex: "",
    name: "",
    stockStatus: "",
    minPrice: "",
    maxPrice: "",
    sort: "",
  });

  const handleSetFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // ✅ đếm số lượng hiển thị & tổng
  const [totalCount, setTotalCount] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // ✅ Lấy tagId từ query param (vd: /products?tag=abc123)
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tagId = params.get("tag");
    if (tagId) {
      // 🔥 Cập nhật filter ban đầu theo tagId
      setFilters((prev) => ({ ...prev, tagName: tagId }));
    }
  }, [location.search]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {/* ✅ truyền visibleCount, totalCount, loading vào SearchBar */}
        <SearchBar
          totalCount={totalCount}
          visibleCount={visibleCount}
          loading={loading}
          onSearch={(value) => handleSetFilters({ name: value || "" })}
          onSortChange={(value) => handleSetFilters({ sort: value })}
        />

        <div className="flex gap-6 mt-6">
          <div className="w-1/4">
            <Sidebar filters={filters} onFilterChange={handleSetFilters} />

          </div>

          <div className="flex-1">
            {/* ✅ ProductList báo ngược lại số lượng và loading */}
            <ProductList
              filters={filters}
              onCounts={(counts) => {
                setVisibleCount(counts.visibleCount);
                setTotalCount(counts.totalCount);
              }}
              onLoadingChange={setLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
