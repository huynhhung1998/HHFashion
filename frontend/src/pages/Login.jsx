import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../icons/icons";
import { Checkbox } from "@heroui/checkbox";
import { Facebook, Mail } from "lucide-react";
import Input from "../components/Input";
import FadeContent from "../components/FadeContent";
import SpinnerLoad from "../components/Spinner";
import useToast from "../hooks/useToast";
import api from "../utils/api";
import Hero from "../components/HomePage/Hero";

export default function Login() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const toast = useToast();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post("/users/login", form);
      const { user, token } = res.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);
      localStorage.setItem("id", user.id);
      window.dispatchEvent(new Event("userUpdated"));
       window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Đăng nhập thành công");
      navigate(user.role === "admin" || user.role === "seller" ? "/dashboard" : "/");
    } catch (err) {
      const msg = err.response?.data?.message || "Có lỗi xảy ra khi đăng nhập";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (platform) => {
    toast.info(`Chức năng đăng nhập bằng ${platform} đang được phát triển`);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Nền Hero */}
      <Hero backgroundOnly />

      {/* Form login */}
      <FadeContent
        blur
        duration={800}
        easing="ease-out"
        initialOpacity={0}
        className="absolute md:right-[8%] lg:right-[12%] md:translate-x-0 translate-x-0
                   bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl 
                   p-8 md:p-10 w-[90%] max-w-md min-h-[520px] flex flex-col justify-center
                   space-y-6 z-10"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Đăng nhập tài khoản
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Tên đăng nhập"
            name="username"
            placeholder="Nhập tên đăng nhập..."
            value={form.username}
            onChange={handleChange}
          />
          <div className="relative">
            <Input
              label="Mật khẩu"
              name="password"
              placeholder="Nhập mật khẩu..."
              type={!isVisible ? "password" : "text"}
              value={form.password}
              onChange={handleChange}
            />
            {isVisible ? (
              <EyeSlashFilledIcon
                className="cursor-pointer absolute bottom-3 right-4"
                onClick={toggleVisibility}
              />
            ) : (
              <EyeFilledIcon
                className="cursor-pointer absolute bottom-3 right-4"
                onClick={toggleVisibility}
              />
            )}
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600">
            <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Quên mật khẩu?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition
              ${isLoading
                ? "bg-blue-500 opacity-80 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"}
            `}
          >
            {isLoading ? (
              <div className="flex justify-center gap-2 items-center">
                <SpinnerLoad /> <span>Đang đăng nhập...</span>
              </div>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>

        {/* <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => handleSocialLogin("Facebook")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            <Facebook size={18} />
            Facebook
          </button>
          <button
            onClick={() => handleSocialLogin("Google")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            <Mail size={18} />
            Google
          </button>
        </div> */}

        <p className="text-sm text-gray-600 text-center">
          Chưa có tài khoản?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline font-medium">
            Đăng ký ngay
          </Link>
        </p>
      </FadeContent>
    </div>
  );
}
