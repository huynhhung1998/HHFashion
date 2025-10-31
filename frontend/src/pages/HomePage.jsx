import React from "react";
import Hero from "../components/HomePage/Hero";
import Navbar from "../components/HomePage/Navbar";
import CategoryGrid from "../components/HomePage/CategoryGrid";
import NewProducts from "../components/HomePage/NewProducts";
import Footer from "../components/HomePage/Footer";


const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Navbar đè lên Hero */}
      <Navbar className="fixed top-0 left-0 w-full z-50" />

      <main className="flex-grow">
        {/* Hero full màn hình */}
        <div className="relative">
          <Hero />
          {/* CategoryGrid đè lên 2/3 Hero */}
          <div className="absolute left-0 w-full -bottom-[12%] z-20">
            <CategoryGrid />
          </div>
        </div>

        {/* Thêm NewProducts sau Hero */}
        <div className="mt-[10rem] md:mt-[12rem]">
          <NewProducts />
        </div>
 <div >
          <Footer />
        </div>
        {/* Spacer nếu cần tránh bị đè */}
        <div/>
      </main>
    </div>
  );
};

export default HomePage;
