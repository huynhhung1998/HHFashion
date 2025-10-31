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

export default function ForgotPassword() {
  const [isVisible, setIsVisible] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [otp, setOtp] = useState("");
  const [openOtp, setOpenOtp] = useState(false);
  const [resetTimer, setResetTimer] = useState(0);
  const [form, setForm] = useState({
    email: "",
    newPassword: "",
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
      await api.post("/users/forgot-password", { email: form.email });
      setOpenOtp(true);
      toast.success("Đã gửi xác nhận", "Vui lòng kiểm tra email");
    } catch (err) {
      toast.error("Có lỗi xảy ra", err.response?.data?.message || "?");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      await api.post("/users/resend-otp-forgot-password", { email: form.email });
      toast.success("OTP đã được gửi lại", "Vui lòng kiểm tra lại email.");
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
      await api.post("/users/verify-forgot-password", { email: form.email, otp });
      toast.success("Xác nhận thành công", "Bạn có thể đổi mật khẩu");
      setShowResetPassword(true);
      setShowResend(false);
    } catch (err) {
      setOtpError(true);
      toast.error("Có lỗi xảy ra", err.response?.data?.message);
    }
  };

  const handleChangePassword = async () => {
    try {
      await api.post("/users/reset-password", {
        email: form.email,
        newPassword: form.newPassword,
      });
      toast.success("Mật khẩu đã được thay đổi", "Bạn có thể đăng nhập lại");
      navigate("/login");
    } catch (err) {
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
            <div className="relative">
              <h2 className="text-3xl font-bold text-gray-800 mb-3 text-center">
                Quên mật khẩu?
              </h2>
              <div
                onClick={() => navigate("/login")}
                className="absolute left-0 top-1 rounded-md hover:bg-blue-100 cursor-pointer"
              >
                <LeftArrowIcon className="text-blue-600 w-6 h-6 hover:text-blue-800" />
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center mb-8">
              Nhập địa chỉ email để lấy lại mật khẩu
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
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
                    <SpinnerLoad /> <span>Đang gửi...</span>
                  </div>
                ) : (
                  "Gửi Email"
                )}
              </button>
            </form>
          </>
        ) : !showResetPassword ? (
          <>
            <div className="relative">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Lấy lại mật khẩu
              </h2>
              <div
                onClick={() => {
                  setOtp("");
                  setOpenOtp(false);
                }}
                className="absolute left-0 top-1 rounded-md hover:bg-blue-100 cursor-pointer"
              >
                <LeftArrowIcon className="text-blue-600 w-6 h-6 hover:text-blue-800" />
              </div>
            </div>
            <p className="text-gray-600 text-center mb-4">
              OTP đã được gửi đến email của bạn. Vui lòng nhập mã để tiếp tục
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
            <div className="flex items-center justify-center mt-2">
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
        ) : (
          <div className="relative">
            <h2 className="mb-8 text-3xl font-bold text-gray-800 text-center">
              Nhập mật khẩu mới
            </h2>
            <div
              onClick={() => navigate("/login")}
              className="absolute left-0 top-1 rounded-md hover:bg-blue-100 cursor-pointer"
            >
              <LeftArrowIcon className="text-blue-600 w-6 h-6 hover:text-blue-800" />
            </div>

            <div className="relative">
              <Input
                label="Mật khẩu mới"
                name="newPassword"
                placeholder="••••••••"
                type={!isVisible ? "password" : "text"}
                value={form.newPassword}
                onChange={handleChange}
              />
              {isVisible ? (
                <EyeSlashFilledIcon
                  className="cursor-pointer absolute bottom-3 right-4"
                  onClick={() => setIsVisible(!isVisible)}
                />
              ) : (
                <EyeFilledIcon
                  className="cursor-pointer absolute bottom-3 right-4"
                  onClick={() => setIsVisible(!isVisible)}
                />
              )}
            </div>

            <button
              type="button"
              onClick={handleChangePassword}
              disabled={isLoading}
              className={`mt-8 w-full py-3 px-4 rounded-lg text-white font-medium transition
                ${isLoading
                  ? "bg-blue-500 opacity-80 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"}
              `}
            >
              {isLoading ? (
                <div className="flex justify-center gap-2 items-center">
                  <SpinnerLoad /> <span>Đang thay đổi...</span>
                </div>
              ) : (
                "Thay đổi mật khẩu"
              )}
            </button>
          </div>
        )}
      </FadeContent>
    </div>
  );
}
