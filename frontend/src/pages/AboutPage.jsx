'use client';
import { motion } from "framer-motion";
import { useRef } from "react";
import Navbar from "../components/HomePage/Navbar";
import Footer from "../components/HomePage/Footer";
import { Sparkles, Target, Users, Gem } from "lucide-react";
import ScrollFloat from "@/components/ui/ScrollFloat";
import SplashCursor from "@/components/ui/SplashCursor";
import Threads from "@/components/ui/Threads";
export default function AboutPage() {
  const scrollRef = useRef(null);

  const sections = [
    {
      icon: <Sparkles className="w-8 h-8 text-pink-500" />,
      title: "Giới thiệu về HH Fashion",
      content: `HH Fashion tự hào là một trong những cửa hàng thời trang hiện đại và năng động, nơi mang đến cho bạn những trải nghiệm mua sắm tuyệt vời nhất. 
Với sứ mệnh “Tôn vinh phong cách – Lan tỏa tự tin”, HH Fashion không chỉ là nơi bán quần áo, mà còn là điểm đến của những ai yêu cái đẹp, yêu sự tinh tế và luôn muốn thể hiện cá tính riêng qua từng trang phục. 
Chúng tôi liên tục cập nhật xu hướng mới nhất từ trong nước và quốc tế, mang đến đa dạng sản phẩm – từ công sở thanh lịch, dạo phố năng động đến dạ tiệc sang trọng. 
Mỗi sản phẩm đều được chọn lọc kỹ về chất liệu, kiểu dáng và đường may, nhằm đảm bảo sự thoải mái và tôn dáng tối đa cho người mặc.`,
    },
    {
      icon: <Target className="w-8 h-8 text-cyan-500" />,
      title: "Mục tiêu & Hướng đến thị trường",
      content: `HH Fashion hướng đến trở thành thương hiệu thời trang được yêu thích hàng đầu tại Việt Nam và từng bước vươn ra quốc tế. 
Chúng tôi không chỉ bán sản phẩm, mà còn truyền cảm hứng về phong cách sống thời trang – phù hợp với giới trẻ, người đi làm, và những ai yêu sự tinh tế. 
Song song đó, HH Fashion đẩy mạnh hệ thống cửa hàng toàn quốc và kênh bán hàng trực tuyến, mang đến trải nghiệm tiện lợi và đáng tin cậy.`,
    },
    {
      icon: <Users className="w-8 h-8 text-violet-500" />,
      title: "Cơ hội nghề nghiệp & Tuyển dụng",
      content: `HH Fashion luôn coi con người là yếu tố cốt lõi. 
Chúng tôi chào đón những nhân tố tài năng, nhiệt huyết và yêu thời trang. 
Môi trường làm việc năng động – chuyên nghiệp, khuyến khích sáng tạo, tôn trọng sự khác biệt, và trao cơ hội phát triển công bằng cho mọi cá nhân.`,
    },
    {
      icon: <Gem className="w-8 h-8 text-amber-500" />,
      title: "Giá trị cốt lõi & Tầm nhìn thương hiệu",
      content: `HH Fashion được xây dựng trên nền tảng: Chất lượng – Sáng tạo – Tận tâm – Bền vững. 
Chúng tôi tin rằng thời trang không chỉ là vẻ đẹp bên ngoài, mà còn là ngôn ngữ thể hiện tâm hồn. 
Mục tiêu của chúng tôi là trở thành biểu tượng thời trang Việt mang tầm khu vực – kết hợp hài hòa giữa phong cách trẻ trung và giá trị văn hóa Việt.`,
    },
  ];

  return (
    <div ref={scrollRef} className="min-h-screen bg-white text-gray-800">
      <Navbar />

       <div className="absolute inset-0 -z-10">
    <Threads
      enableMouseInteraction
      color={[0.8, 0.9, 1]}
      amplitude={1.2}
      distance={0.8}
      backgroundType="gradient"
    />
  </div>

       <div className="px-6 md:px-20 py-24 max-w-5xl mx-auto space-y-20 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center text-5xl md:text-6xl font-extrabold text-gray-900"
        >
          <span className="bg-gradient-to-r from-pink-500 via-cyan-500 to-violet-500 bg-clip-text text-transparent">
            Giới thiệu về HH Fashion
          </span>
        </motion.h1>

        {sections.map((s, i) => (
          <motion.section
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 * i }}
            viewport={{ once: true }}
            className="bg-gray-50 border border-gray-200 rounded-3xl shadow-sm p-8 md:p-12"
          >
            <div className="flex items-center gap-4 mb-4">
              {s.icon}
              <ScrollFloat
                scrollContainerRef={scrollRef}
                containerClassName="overflow-hidden"
                textClassName="font-semibold text-2xl md:text-3xl text-gray-900"
              >
                {s.title}
              </ScrollFloat>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
              {s.content}
            </p>
          </motion.section>
        ))}

        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-gray-500 text-sm pt-12"
        >
          © 2025 HH Fashion. All rights reserved.
        </motion.footer>
      </div>
 <SplashCursor color="#e879f9" blendMode="multiply" opacity={0.2} />
      <Footer />
    </div>
  );
}
