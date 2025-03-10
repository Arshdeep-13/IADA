import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// import ResCarousel2 from "../assets/Carousel/ResCarousel2.jpeg";
// import ResCarousel3 from "../assets/Carousel/ResCarousel3.jpeg";
// import ResCarousel1 from "../assets/Carousel/ResCarousel1.jpeg";
// import LargeImg1 from "../assets/Carousel/LargeImg1.jpg";
// import LargeImg2 from "../assets/Carousel/LargeImg2.jpg";
// import LargeImg3 from "../assets/Carousel/LargeImg3.jpg";
// import LargeImg4 from "../assets/Carousel/LargeImg4.jpg";
import SWCA_Logo2 from "../public/SWCA_Logo.webp";
import SWCA_Logo from "../public/SWCA_Logo.webp";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";

function Carousel() {
  return (
    <div>
      <div className="w-full md:h-auto bg-black">
        {/* MOBILE SCREENS */}
        <Swiper
          // loop={true}
          spaceBetween={30}
          centeredSlides={true}
          // autoplay={{
          //   delay: 2500,
          //   disableOnInteraction: false,
          // }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper h-full md:hidden bg-[#1D1956]"
        >
          <SwiperSlide className="md:hidden block">
            <img src={SWCA_Logo2} className="w-full" loading="lazy" />
          </SwiperSlide>
          {/* <SwiperSlide className="h-full md:hidden">
            <img src={ResCarousel2} className="w-full" loading="lazy" />
          </SwiperSlide>
          <SwiperSlide className="h-full md:hidden">
            <img src={ResCarousel3} className="w-full" loading="lazy" />
          </SwiperSlide> */}
        </Swiper>
        {/* MEDIUM AND LARGE SCREEN */}
        <Swiper
          // loop={true}
          spaceBetween={30}
          centeredSlides={true}
          // autoplay={{
          //   delay: 2500,
          //   disableOnInteraction: false,
          // }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper h-full hidden md:block bg-[#1D1956]"
        >
          <SwiperSlide className="hidden md:block">
          <div className="flex flex-row justify-around items-center gap-10 px-6 h-26">
            <img
              src={SWCA_Logo}
              className="h-[26rem] object-contain"
              loading="lazy"
            />
            <div className="text-center flex flex-col gap-4 mr-24">
              <h1 className="text-4xl text-white font-bold">
                Welcome to SWCA
              </h1>
              <p className="text-white">
                GST IN: 02AABAI3805R1ZN
                <br/>
                PAN ID: AABAI3805R
              </p>
            </div>
          </div>

          </SwiperSlide>
          {/* <SwiperSlide className="hidden md:block">
            <img src={LargeImg2} className="w-full" loading="lazy" />
          </SwiperSlide>
          <SwiperSlide className="hidden md:block">
            <img src={LargeImg3} className="w-full" loading="lazy" />
          </SwiperSlide>
          <SwiperSlide className="hidden md:block">
            <img src={LargeImg4} className="w-full" loading="lazy" />
          </SwiperSlide> */}
        </Swiper>
      </div>
    </div>
  );
}

export default Carousel;
