// src/components/DashboardPage/Product/DeleteProductModal.jsx
import api from "@/utils/api";

export default function DeleteProductModal({ product, onClose, onSuccess }) {
  if (!product) return null;

  const handleDelete = async () => {
    try {
      await api.delete(`/products/${product._id}`);
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error("Xóa sản phẩm thất bại:", err?.response?.data ?? err);
      alert("Xóa sản phẩm thất bại!");
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">Xác nhận xóa</h2>
        <p>
          Bạn có chắc chắn muốn xóa sản phẩm{" "}
          <span className="font-bold">{product.productName}</span> không?
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
