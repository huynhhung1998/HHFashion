import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user")); // hoặc lấy từ context/state

  if (user) {
    // Tùy role mà redirect
    if (user.role === "admin" || user.role === "seller") {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PublicRoute;
