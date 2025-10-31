import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/HomePage";
import MyAccount from "./pages/MyAccount";
import Profile from "./pages/Profile";
import DashboardPage from "./pages/DashboardPage";
import UserPage from "./pages/UserPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import AboutPage from "./pages/AboutPage";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<ProductPage />} />
<Route path="/about" element={<AboutPage />} />

      {/* Các route public (chỉ vào được nếu CHƯA đăng nhập) */}
     <Route
  path="/login"
  element={
    <PublicRoute>
      <Login />
    </PublicRoute>
  }
/>
<Route
  path="/signup"
  element={
    <PublicRoute>
      <Signup />
    </PublicRoute>
  }
/>
<Route
  path="/forgot-password"
  element={
    <PublicRoute>
      <ForgotPassword />
    </PublicRoute>
  }
/>


      <Route path="/myaccount" element={<MyAccount />}>
        <Route index element={<Profile />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="/user" element={<UserPage />} />
      <Route path="/cart" element={<CartPage />} />
      
      {/* Route cần đăng nhập + đúng role */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute allowedRoles={["admin", "seller"]}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
