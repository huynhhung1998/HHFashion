import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";
import useToast from "../hooks/useToast";
import Navbar from "../components/HomePage/Navbar";
import Footer from "../components/HomePage/Footer";
import SplashCursor from "@/components/ui/SplashCursor";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState("");
  const [showModal, setShowModal] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me", { withCredentials: true });
        setUser(res.data.data.user);
        setPreview(res.data.data.user.avatar || "");
        localStorage.setItem("user", JSON.stringify(res.data.data.user));
      } catch (err) {
        console.error("Không thể tải thông tin user:", err);
      }
    };
    fetchUser();
  }, []);

  if (!user) return null;

  const validationSchema = Yup.object({
    fullname: Yup.string().required("Họ và tên không được trống"),
    email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
    phone: Yup.string()
      .matches(/^(0|\+84)(\d{9})$/, "Số điện thoại không hợp lệ")
      .required("Vui lòng nhập số điện thoại"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await api.patch("/users/me", values, { withCredentials: true });
      setUser(res.data.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      toast.success("Thành công", "Cập nhật thông tin thành công!");
    } catch (err) {
      toast.error("Lỗi", err.response?.data?.message || "Không thể cập nhật!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvatarSave = async (newLink) => {
    try {
      const res = await api.patch(
        "/users/me",
        { avatar: newLink },
        { withCredentials: true }
      );
      setUser(res.data.data.user);
      setPreview(newLink);
      toast.success("Thành công", "Ảnh đại diện đã được cập nhật!");
      setShowModal(false);
    } catch (err) {
      toast.error("Lỗi", "Không thể cập nhật ảnh đại diện!");
    }
  };

  const handleResetPassword = () => {
  localStorage.clear();
  window.dispatchEvent(new Event("userUpdated"));
  window.dispatchEvent(new Event("cartUpdated"));
  setUser(null);
  if (typeof setCartCount === "function") setCartCount(0);
  navigate("/forgot-password");
};

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-16 px-6 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-10 border border-gray-100"
        >
          <h2 className="text-3xl font-semibold text-blue-600 mb-8 text-center">
            Hồ sơ người dùng
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left column */}
            <div className="flex flex-col items-center">
              <motion.img
                src={preview || "https://via.placeholder.com/150"}
                alt="Avatar"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-40 h-40 rounded-full object-cover border-4 border-blue-300 shadow-md mb-4 cursor-pointer hover:shadow-lg"
                onClick={() => setShowModal(true)}
              />
              <p className="text-gray-500 mb-1">Nhấn để thay đổi ảnh</p>
              <p className="text-gray-800 font-semibold">@{user.username}</p>
            </div>

            {/* Right column */}
            <Formik
              initialValues={{
                fullname: user.fullname || "",
                email: user.email || "",
                phone: user.phone || "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, isValid }) => (
                <Form className="space-y-5">
                  {/* Họ và tên */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên
                    </label>
                    <Field
                      type="text"
                      name="fullname"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <ErrorMessage
                      name="fullname"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Field
                      type="email"
                      name="email"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Số điện thoại */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại
                    </label>
                    <Field
                      type="text"
                      name="phone"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Nút lưu */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md disabled:bg-gray-400"
                  >
                    {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                  </motion.button>

                  {/* Đặt lại mật khẩu */}
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    className="w-full text-red-500 text-sm font-medium underline hover:text-red-600 transition mt-3"
                  >
                    Đặt lại mật khẩu
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </motion.div>
      </div>

      {/* Modal nhập link avatar */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Cập nhật ảnh đại diện
              </h3>
              <input
                type="text"
                defaultValue={preview}
                placeholder="Dán link ảnh mới..."
                id="avatarLink"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none mb-4"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  onClick={() =>
                    handleAvatarSave(document.getElementById("avatarLink").value)
                  }
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Lưu
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
