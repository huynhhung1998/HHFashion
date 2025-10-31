import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role; // ✅ Lấy role chuẩn từ user object

  // ❌ Nếu chưa đăng nhập
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Nếu role không nằm trong danh sách cho phép
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Nếu là user thường → về trang chủ
    if (role === "user") {
      return <Navigate to="/" replace />;
    }
    // Nếu role khác (không được phép) → về login
    return <Navigate to="/login" replace />;
  }

  // ✅ Nếu đúng quyền
  return children;
}
