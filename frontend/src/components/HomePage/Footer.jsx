import React from "react";
import { Facebook, Mail, Phone, MapPin } from "lucide-react";
import Logo from "../../assets/Logo.jpg";
const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="footer-section" className="bg-gray-900 text-gray-300 py-10 px-6 md:px-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Logo */}
        <div
          onClick={scrollToTop}
          className="cursor-pointer flex items-center gap-2 group"
        >
          <img
            src={Logo}
            alt="Logo"
            className="w-12 h-12 object-cover rounded-full group-hover:scale-105 transition"
          />
          <span className="text-xl font-semibold text-white group-hover:text-blue-400 transition">
            MyStore
          </span>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-center md:text-left">
          <p className="flex items-center justify-center md:justify-start gap-2">
            <MapPin size={18} /> 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh
          </p>

          <a
            href="tel:0763956505"
            className="flex items-center justify-center md:justify-start gap-2 hover:text-blue-400 transition"
          >
            <Phone size={18} /> 0763956505
          </a>

          <a
            href="mailto:vuhung.boy@gmail.com"
            className="flex items-center justify-center md:justify-start gap-2 hover:text-blue-400 transition"
          >
            <Mail size={18} /> vuhung.boy@gmail.com
          </a>

          <a
            href="https://fb.com/vuhung.boy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center md:justify-start gap-2 hover:text-blue-500 transition"
          >
            <Facebook size={18} /> Admin Fashion Store
          </a>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} MyStore. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
