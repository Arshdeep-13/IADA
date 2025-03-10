import React from "react";
import lionImg from "../assets/webpImages/lion.webp";

const LionComponent = () => {
  return (
    <div className="px-4 sm:px-10 py-8">
      <div className="relative flex flex-col sm:flex-row bg-gradient-to-r from-gray-100 to-gray-300 rounded-lg  overflow-hidden">
        {/* Image Section */}
        <div
          className="relative w-full sm:w-1/2 flex items-center justify-center"
          style={{ filter: "drop-shadow(0 0 0.75rem rgba(0, 0, 0, 0.3))" }}
        >
          <img
            className="w-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
            src={lionImg}
            alt="Lion Image"
            loading="lazy"
          />
        </div>

        {/* Text Section */}
        <div className="flex items-center justify-center w-full sm:w-1/2 p-6 sm:p-8 ">
          <span
            className="relative text-gray-800 dark:text-white text-3xl sm:text-4xl lg:text-6xl font-bold text-center 
                       tracking-wide leading-snug transition-all duration-500 ease-in-out 
                       hover:scale-105"
          >
            Ministry of Commerce & Industry
            {/* Animated Underline */}
            <span className="absolute left-1/2 bottom-[-10px] h-[4px] w-0 bg-blue-500 transition-all duration-500 ease-in-out hover:w-full hover:left-0"></span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LionComponent;
