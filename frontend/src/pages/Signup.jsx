import Input from "../components/Input";
import FadeContent from "../components/FadeContent";
import { useEffect, useState } from "react";
import api from "../utils/api";
import useToast from "../hooks/useToast";
import SpinnerLoad from "../components/Spinner";
import InputOTP from "../components/InputOTP";
import CountdownTimer from "../components/CountDownTimer";
import { Link, useNavigate } from "react-router-dom";
import {
  EyeFilledIcon,
  EyeSlashFilledIcon,
  LeftArrowIcon,
} from "../icons/icons";
import Hero from "../components/HomePage/Hero";

export default function Signup() {
  const [showResend, setShowResend] = useState(false);
  const [isVisible1, setIsVisible1] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [otp, setOtp] = useState("");
  const [openOtp, setOpenOtp] = useState(false);
  const [resetTimer, setResetTimer] = useState(0);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (openOtp) {
      setShowResend(false);
      const timer = setTimeout(() => {
        setShowResend(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [openOtp]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/users/signup", form);
      toast.success("Đăng ký thành công", "Vui lòng xác thực tài khoản");
      setOpenOtp(true);
    } catch (err) {
      toast.error("Có lỗi xảy ra", err.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/users/resend-otp", { email: form.email });
      toast.success("OTP đã được gửi lại", "Vui lòng kiểm tra email");
      setResetTimer((k) => k + 1);
      setShowResend(false);
    } catch (err) {
      toast.error("Có lỗi xảy ra", err.response?.data?.message || "Không thể gửi lại OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await api.post("/users/verify-otp", { email: form.email, otp });
      toast.success("Đăng ký thành công", "Bạn có thể đăng nhập ngay");
      navigate("/login");
    } catch (err) {
      setOtpError(true);
      toast.error("Có lỗi xảy ra", err.response?.data?.message);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Hero background */}
      <Hero backgroundOnly />

      {/* Form */}
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
        {!openOtp ? (
          <>
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
              Đăng ký tài khoản
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Tên đăng nhập"
                name="username"
                placeholder="Ex: username"
                value={form.username}
                onChange={handleChange}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />

              <div className="relative">
                <Input
                  label="Mật khẩu"
                  name="password"
                  placeholder="••••••••"
                  type={!isVisible1 ? "password" : "text"}
                  value={form.password}
                  onChange={handleChange}
                />
                {isVisible1 ? (
                  <EyeSlashFilledIcon
                    className="cursor-pointer absolute bottom-3 right-4"
                    onClick={() => setIsVisible1(!isVisible1)}
                  />
                ) : (
                  <EyeFilledIcon
                    className="cursor-pointer absolute bottom-3 right-4"
                    onClick={() => setIsVisible1(!isVisible1)}
                  />
                )}
              </div>

              <div className="relative">
                <Input
                  label="Xác nhận mật khẩu"
                  name="passwordConfirm"
                  placeholder="••••••••"
                  type={!isVisible2 ? "password" : "text"}
                  value={form.passwordConfirm}
                  onChange={handleChange}
                />
                {isVisible2 ? (
                  <EyeSlashFilledIcon
                    className="cursor-pointer absolute bottom-3 right-4"
                    onClick={() => setIsVisible2(!isVisible2)}
                  />
                ) : (
                  <EyeFilledIcon
                    className="cursor-pointer absolute bottom-3 right-4"
                    onClick={() => setIsVisible2(!isVisible2)}
                  />
                )}
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
                    <SpinnerLoad /> <span>Đang đăng ký...</span>
                  </div>
                ) : (
                  "Đăng ký"
                )}
              </button>
            </form>

            <p className="text-sm text-gray-600 text-center">
              Đã có tài khoản?{" "}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">
                Đăng nhập ngay
              </Link>
            </p>
          </>
        ) : (
          <>
            <div className="relative">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Xác thực tài khoản
              </h2>
              <div
                onClick={() => {
                  setOtp("");
                  setOpenOtp(false);
                }}
                className="absolute left-0 top-1 rounded-md hover:bg-blue-100 cursor-pointer transition-colors"
              >
                <LeftArrowIcon className="text-blue-600 w-6 h-6 hover:text-blue-800" />
              </div>
            </div>

            <p className="text-gray-600 text-center">
              OTP đã được gửi đến email của bạn. Vui lòng nhập mã để xác thực.
            </p>

            <div className="flex justify-center">
              <InputOTP
                isInvalid={otpError}
                value={otp}
                onChange={setOtp}
                onValueChange={(val) => {
                  setOtp(val);
                  if (otpError) setOtpError(false);
                }}
                onComplete={handleVerifyOtp}
              />
            </div>

            <div className="flex items-center justify-center">
              <p>Thời gian còn lại: </p>
              <CountdownTimer resetTrigger={resetTimer} />
            </div>

            {showResend && (
              <div className="mt-3 text-center">
                {!isLoading ? (
                  <p className="text-gray-600">
                    Không nhận được mã?{" "}
                    <span
                      onClick={handleResendOtp}
                      className="font-semibold text-blue-600 cursor-pointer hover:text-blue-800"
                    >
                      Gửi lại OTP
                    </span>
                  </p>
                ) : (
                  <div className="flex justify-center gap-2 items-center">
                    <SpinnerLoad /> <span>Đang gửi lại OTP...</span>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </FadeContent>
    </div>
  );
}
