import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

// Button component
function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// Input component
function Input({ type = "text", value, onChange, placeholder, className = "", ...props }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border rounded px-3 py-2 w-full ${className}`}
      {...props}
    />
  );
}

export default function UpdateUserModal({ user, onClose, onConfirm }) {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    fullname: user?.fullname || "",
    phone: user?.phone || "",
    avatar: user?.avatar || "",
    role: user?.role || "user",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        fullname: user.fullname || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
        role: user.role || "user",
        password: "",
      });
    }
  }, [user]);

  // validate theo model
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

  // realtime validate border đỏ
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const errMsg = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: errMsg ? "invalid" : "",
    }));
  };

  const handleSubmit = async () => {
    let newErrors = {};
    let hasError = false;
    let updatedData = {};

    Object.keys(formData).forEach((key) => {
      if (key === "password" && !isEditingPassword) return;

      if (formData[key] !== user[key]) {
        const errMsg = validateField(key, formData[key]);
        if (errMsg) {
          hasError = true;
          newErrors[key] = errMsg;

          setFormData((prev) => ({
            ...prev,
            [key]: "",
          }));

          setTimeout(() => {
            setErrors((prev) => ({ ...prev, [key]: "invalid" }));
            setFormData((prev) => ({
              ...prev,
              [key]: user[key] || "",
            }));
          }, 3000);
        } else {
          updatedData[key] = formData[key];
        }
      }
    });

    if (hasError) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }

    if (Object.keys(updatedData).length > 0) {
      try {
        await onConfirm(user._id, updatedData);
        onClose();
      } catch (err) {
        console.error("Update thất bại:", err);
      }
    } else {
      onClose();
    }
  };

  if (!user) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">Chỉnh sửa người dùng</h2>

        <div className="space-y-3 mb-6">
          {/* username */}
          <Input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder={
              errors.username && errors.username !== "invalid"
                ? errors.username
                : "Tên đăng nhập"
            }
            className={`${
              errors.username ? "border-red-500 placeholder-red-500" : ""
            }`}
          />

          {/* email */}
          <Input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={
              errors.email && errors.email !== "invalid"
                ? errors.email
                : "Email"
            }
            className={`${
              errors.email ? "border-red-500 placeholder-red-500" : ""
            }`}
          />

          {/* fullname */}
          <Input
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            placeholder="Họ tên"
          />

          {/* phone */}
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder={
              errors.phone && errors.phone !== "invalid"
                ? errors.phone
                : "Số điện thoại"
            }
            className={`${
              errors.phone ? "border-red-500 placeholder-red-500" : ""
            }`}
          />

          {/* avatar */}
          <Input
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            placeholder="Link avatar (tùy chọn)"
          />

          {/* role */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="user">User</option>
            <option value="seller">Seller</option>
  
            <option value="admin">Admin</option>
            
          </select>

          {/* đổi mật khẩu */}
          {!isEditingPassword ? (
            <p
              onClick={() => setIsEditingPassword(true)}
              className="text-blue-600 text-sm cursor-pointer hover:underline mt-4"
            >
              Đổi mật khẩu
            </p>
          ) : (
            <div className="mt-4">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={
                    errors.password && errors.password !== "invalid"
                      ? errors.password
                      : "Mật khẩu mới"
                  }
                  className={`pr-10 ${
                    errors.password ? "border-red-500 placeholder-red-500" : ""
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
              <p
                onClick={() => {
                  setIsEditingPassword(false);
                  setFormData((prev) => ({ ...prev, password: "" }));
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
                className="text-xs text-gray-500 cursor-pointer hover:underline mt-1"
              >
                Hủy
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button className="bg-gray-300 text-black hover:bg-gray-400" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>Lưu</Button>
        </div>
      </div>
    </div>
  );
}