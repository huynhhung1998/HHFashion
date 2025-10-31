import { useState, useEffect } from "react";
import api from "@/utils/api";

export default function AddProductModal({ open, onClose, onSuccess }) {
  const [selectedTags, setSelectedTags] = useState([""]); // nhiều select tag
  const [tags, setTags] = useState([]);
  const [imgs, setImgs] = useState([""]);
  const [sex, setSex] = useState("Unisex");

  useEffect(() => {
    if (open) {
      fetchTags();
      setImgs([""]);
      setSex("Unisex");
      setSelectedTags([""]); // reset khi mở modal
    }
  }, [open]);

  const fetchTags = async () => {
    try {
      const res = await api.get("/tags");
      setTags(res.data?.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy tags:", err);
    }
  };

  const handleTagChange = (idx, value) => {
    setSelectedTags((prev) => {
      const newArr = [...prev];
      newArr[idx] = value;
      return newArr;
    });
  };

  const addMoreTagSelect = () => setSelectedTags((prev) => [...prev, ""]);
  const removeTagSelect = (idx) =>
    setSelectedTags((prev) => prev.filter((_, i) => i !== idx));

  if (!open) return null;

  const handleImgChange = (idx, value) => {
    setImgs((prev) => {
      const newImgs = [...prev];
      newImgs[idx] = value;
      return newImgs;
    });
  };

  const addMoreImg = () => setImgs((prev) => [...prev, ""]);
  const removeImg = (idx) =>
    setImgs((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = {
        productName: e.target.productName.value.trim(),
        price: Number(e.target.price.value),
        quantity: Number(e.target.quantity.value),
        description: e.target.description.value.trim(),
        img: imgs.filter((url) => url.trim() !== ""),
        tags: selectedTags.filter((id) => id), // loại bỏ select trống
        store: null,
        sex,
      };

      if (formData.price < 0) {
        alert("Giá phải >= 0!");
        return;
      }
      if (!Number.isInteger(formData.quantity) || formData.quantity < 0) {
        alert("Số lượng phải là số nguyên >= 0!");
        return;
      }

      const res = await api.post("/products/", formData);
      console.log("Thêm sản phẩm thành công:", res.data);

      onClose();
      onSuccess?.();
    } catch (err) {
      console.error("Thêm sản phẩm thất bại:", err?.response?.data ?? err);
      alert("Thêm sản phẩm thất bại!");
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-40">
      <div
        className="fixed inset-0 backdrop-blur-sm bg-black/10"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg p-6 z-50">
        <h2 className="text-lg font-semibold mb-4">Thêm sản phẩm mới</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="productName"
            placeholder="Tên sản phẩm"
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="Giá sản phẩm"
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <input
            name="quantity"
            type="number"
            min="0"
            step="1"
            placeholder="Số lượng"
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <textarea
            name="description"
            placeholder="Mô tả"
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* nhiều ảnh */}
          <div className="space-y-2">
            {imgs.map((url, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  value={url}
                  onChange={(e) => handleImgChange(idx, e.target.value)}
                  placeholder={`Link ảnh ${idx + 1}`}
                  className="flex-1 border rounded-lg px-3 py-2"
                />
                {imgs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImg(idx)}
                    className="px-2 text-red-500"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addMoreImg}
              className="text-blue-600 text-sm hover:underline"
            >
              + Thêm ảnh
            </button>
          </div>

          {/* nhiều select tag */}
          <div className="space-y-2">
            {selectedTags.map((tagId, idx) => (
              <div key={idx} className="flex gap-2">
                <select
                  value={tagId}
                  onChange={(e) => handleTagChange(idx, e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2"
                >
                  <option value="">-- Chọn loại --</option>
                  {tags.length > 0 ? (
                    tags.map((tag) => (
                      <option key={tag._id} value={tag._id}>
                        {tag.nameTag}
                      </option>
                    ))
                  ) : (
                    <option disabled>(Chưa có loại nào)</option>
                  )}
                </select>
                {selectedTags.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTagSelect(idx)}
                    className="px-2 text-red-500"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addMoreTagSelect}
              className="text-blue-600 text-sm hover:underline"
            >
              + Thêm loại
            </button>
          </div>

          {/* Dropdown chọn giới tính */}
          <select
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="Unisex">Unisex</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Trẻ em">Trẻ Em</option>
          </select>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
