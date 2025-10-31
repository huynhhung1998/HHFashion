// src/components/DashboardPage/Store/NotesModal.jsx
import React, { useEffect, useState } from "react";
import { X, Loader2, Trash2, PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/utils/api";
import useToast from "@/hooks/useToast"; // 🧃 hook toast

const NotesModal = ({ isOpen, order, onClose }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // 🟢 Lấy ghi chú khi modal mở
  useEffect(() => {
    if (!isOpen || !order?._id) return;
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/orders/${order._id}`);
        setNotes(res.data?.data?.note || []);
      } catch (err) {
        console.error("Fetch notes error:", err);
        toast.error("Không thể tải ghi chú 😢");
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [isOpen, order?._id]);

  // 🟡 Thêm ghi chú
  const handleAddNote = async () => {
    if (!newNote.trim()) return toast.warning("Vui lòng nhập nội dung ghi chú ✍️");
    try {
      setLoading(true);
      const res = await api.post(`/orders/${order._id}/notes`, { note: newNote });
      setNotes(res.data?.data?.note || []);
      setNewNote("");
      toast.success("Đã thêm ghi chú 📝");
    } catch (err) {
      console.error("❌ Lỗi khi thêm ghi chú:", err);
      toast.error("Thêm ghi chú thất bại 😢");
    } finally {
      setLoading(false);
    }
  };

  // 🔴 Xóa ghi chú (đảm bảo chắc chắn xóa được)
  const handleDeleteNote = async (index) => {
    if (!window.confirm("Bạn có chắc muốn xóa ghi chú này?")) return;
    try {
      setLoading(true);
      const res = await api.delete(`/orders/${order._id}/notes/${index}`);
      setNotes(res.data?.data?.note || []);
      toast.success("Đã xóa ghi chú 🗑️");
    } catch (err) {
      console.error("❌ Lỗi khi xóa ghi chú:", err);
      toast.error("Xóa ghi chú thất bại 😢");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="bg-white w-full max-w-md rounded-2xl shadow-lg p-5 relative"
          >
            {/* Nút đóng */}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-700 transition"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-semibold mb-4">
              Ghi chú đơn #{(order?._id || "").slice(-6).toUpperCase()}
            </h2>

            {loading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="animate-spin text-gray-400" size={30} />
              </div>
            ) : (
              <>
                <ul className="space-y-2 max-h-64 overflow-y-auto mb-4 pr-1">
                  {notes.length ? (
                    notes.map((n, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                      >
                        <span className="text-sm text-gray-700 break-words">{n}</span>
                        <Trash2
                          size={16}
                          onClick={() => handleDeleteNote(i)}
                          className="text-gray-400 hover:text-red-500 cursor-pointer transition"
                        />
                      </motion.li>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center">
                      Chưa có ghi chú nào.
                    </p>
                  )}
                </ul>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Thêm ghi chú..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={loading}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1 transition"
                  >
                    <PlusCircle size={16} /> Thêm
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotesModal;
