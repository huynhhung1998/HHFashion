import { useState, useEffect } from "react";
import { X, Plus, ToggleLeft, ToggleRight } from "lucide-react";
import api from "@/utils/api";

export default function EditProductModal({ product, onClose, onSuccess }) {
  const [form, setForm] = useState({
    productName: "",
    price: 0,
    quantity: 0,
    description: "",
    img: [""],
    tags: [],
    status: "Đang bán",
    sex: "Unisex",
  });

  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    api.get("/tags").then((res) => {
      setAllTags(res.data?.data || []);
    });
  }, []);

  useEffect(() => {
    if (product) {
      setForm({
        productName: product.productName || "",
        price: product.price || 0,
        quantity: product.quantity || 0,
        description: product.description || "",
        img: product.img?.length ? product.img : [""],
        tags: Array.isArray(product.tags)
          ? product.tags.map((t) => (typeof t === "string" ? t : t._id))
          : [],
        status: product.status || "Đang bán",
        sex: product.sex || "Unisex",
      });
    }
  }, [product]);

  if (!product) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImgChange = (idx, value) => {
    setForm((prev) => {
      const newImgs = [...prev.img];
      newImgs[idx] = value;
      return { ...prev, img: newImgs };
    });
  };

  const addMoreImg = () => {
    setForm((prev) => ({ ...prev, img: [...prev.img, ""] }));
  };

  const addTagSelect = () => {
    setForm((prev) => ({ ...prev, tags: [...prev.tags, ""] }));
  };

  const handleTagChange = (idx, value) => {
    setForm((prev) => {
      const newTags = [...prev.tags];
      newTags[idx] = value;
      return { ...prev, tags: newTags };
    });
  };

  const removeTag = (idx) => {
    setForm((prev) => {
      const newTags = prev.tags.filter((_, i) => i !== idx);
      return { ...prev, tags: newTags };
    });
  };

  const toggleStatus = () => {
    setForm((prev) => ({
      ...prev,
      status: prev.status === "Đang bán" ? "Ngưng bán" : "Đang bán",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        tags: form.tags.filter((t) => t !== ""),
      };
      await api.put(`/products/${product._id}`, payload);
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error("Cập nhật sản phẩm thất bại:", err?.response?.data ?? err);
      alert("Cập nhật sản phẩm thất bại!");
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6">
        <h2 className="text-2xl font-semibold mb-4 text-red-600"><span className="font-bold">{product.productName}</span></h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tên, giá, số lượng */}
          <div className="grid grid-cols-3 gap-4">
            <input
              name="productName"
              value={form.productName}
              onChange={handleChange}
              placeholder="Tên sản phẩm"
              className="w-full border rounded-lg px-3 py-2"
              required
            />
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Giá"
              className="w-full border rounded-lg px-3 py-2"
              required
            />
            <input
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              placeholder="Số lượng"
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          {/* Mô tả */}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Mô tả"
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* Ảnh */}
          {/* Ảnh */}
<div className="space-y-2">
  <label className="block text-sm font-medium">Hình ảnh</label>
  {form.img.map((url, idx) => (
    <div key={idx} className="flex items-center gap-3">
      <input
        value={url}
        onChange={(e) => handleImgChange(idx, e.target.value)}
        placeholder={`Link ảnh ${idx + 1}`}
        className="flex-1 border rounded-lg px-3 py-2"
      />
      {url && (
        <img
          src={url}
          alt="preview"
          className="w-12 h-12 rounded-full object-cover border"
        />
      )}
      {form.img.length > 1 && (
        <button
          type="button"
          onClick={() => {
            setForm(prev => ({
              ...prev,
              img: prev.img.filter((_, i) => i !== idx)
            }));
          }}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <X size={16} />
        </button>
      )}
    </div>
  ))}
  <button
    type="button"
    onClick={addMoreImg}
    className="flex items-center text-blue-600 text-sm hover:underline"
  >
    <Plus size={16} className="mr-1" /> Thêm ảnh
  </button>
</div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium">Danh mục (Tags)</label>
            {form.tags.map((tagId, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <select
                  value={tagId}
                  onChange={(e) => handleTagChange(idx, e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2"
                >
                  <option value="">-- Chọn loại --</option>
                  {allTags.map((tag) => (
                    <option key={tag._id} value={tag._id}>
                      {tag.nameTag}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeTag(idx)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addTagSelect}
              className="flex items-center text-blue-600 text-sm hover:underline"
            >
              <Plus size={16} className="mr-1" /> Thêm tag
            </button>
          </div>

          {/* Giới tính */}
          <div>
            <label className="block text-sm font-medium mb-1">Giới tính</label>
            <select
              name="sex"
              value={form.sex}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Trẻ em">Trẻ em</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>

          {/* Trạng thái toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Trạng thái:</span>
            <button
              type="button"
              onClick={toggleStatus}
              className="flex items-center gap-2"
            >
              {form.status === "Đang bán" ? (
                <>
                  <ToggleRight className="text-green-500" /> Đang bán
                </>
              ) : (
                <>
                  <ToggleLeft className="text-red-500" /> Ngưng bán
                </>
              )}
            </button>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
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
