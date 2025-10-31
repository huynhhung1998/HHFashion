import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react"; // icon mắt

export default function AddUserModal({ isOpen, onClose, onConfirm }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullname: "",
    phone: "",
    avatar: "",
    role: "user",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // validate theo UserModel
  const validateField = (name, value) => {
    switch (name) {
      case "username":
        if (!value.trim()) return "Tên đăng nhập không được trống";
        return "";
      case "email":
        if (!value) return "Email không được trống";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Sai định dạng Email";
        return "";
      case "password":
        if (!value) return "Mật khẩu không được trống";
        if (value.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự";
        const pwRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])/;
        if (!pwRegex.test(value))
          return "Mật khẩu phải chứa ít nhất 1 số và 1 ký tự đặc biệt";
        return "";
      case "phone":
        if (!value) return "Số điện thoại không được trống";
        const phoneRegex = /^[0-9]{9,11}$/;
        if (!phoneRegex.test(value)) return "Số điện thoại không hợp lệ";
        return "";
      default:
        return "";
    }
  };

  // realtime validate (chỉ border đỏ)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const errMsg = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: errMsg ? "invalid" : "",
    }));
  };

  // khi bấm submit
  const handleSubmit = async () => {
    let newErrors = {};
    let hasError = false;

    for (let key of ["username", "email", "password", "phone"]) {
      const errMsg = validateField(key, formData[key]);
      if (errMsg) {
        hasError = true;
        newErrors[key] = errMsg;
        setFormData((prev) => ({ ...prev, [key]: "" })); // xoá nội dung sai
        // hiển thị lỗi 3s
        setTimeout(() => {
          setErrors((prev) => ({ ...prev, [key]: "invalid" }));
        }, 3000);
      }
    }

    if (hasError) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }

    try {
      await onConfirm(formData);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">Thêm người dùng</h2>

        <div className="space-y-3">
          {/* username */}
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder={errors.username && errors.username !== "invalid" ? errors.username : "Tên đăng nhập"}
            className={`w-full border px-3 py-2 rounded ${
              errors.username ? "border-red-500 placeholder-red-500" : "border-gray-300"
            }`}
          />

          {/* email */}
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={errors.email && errors.email !== "invalid" ? errors.email : "Email"}
            className={`w-full border px-3 py-2 rounded ${
              errors.email ? "border-red-500 placeholder-red-500" : "border-gray-300"
            }`}
          />

          {/* password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={errors.password && errors.password !== "invalid" ? errors.password : "Mật khẩu"}
              className={`w-full border px-3 py-2 rounded pr-10 ${
                errors.password ? "border-red-500 placeholder-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* fullname */}
          <input
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            placeholder="Họ tên"
            className="w-full border px-3 py-2 rounded border-gray-300"
          />

          {/* phone */}
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder={errors.phone && errors.phone !== "invalid" ? errors.phone : "Số điện thoại"}
            className={`w-full border px-3 py-2 rounded ${
              errors.phone ? "border-red-500 placeholder-red-500" : "border-gray-300"
            }`}
          />

          {/* avatar link */}
          <input
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            placeholder="Link avatar (tùy chọn)"
            className="w-full border px-3 py-2 rounded border-gray-300"
          />

          {/* role */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded border-gray-300"
          >
            <option value="user">User</option>
            <option value="seller">Seller</option>
            <option value="shipper">Shipper</option>
            <option value="admin">Admin</option>
            <option value="route manager">Route Manager</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
}
