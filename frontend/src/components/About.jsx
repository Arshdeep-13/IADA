import React from "react";
import kantImg from "../public/amitabh kant.jpg";
import industry1Img from "../public/industry2.webp";
import industry2Img from "../public/Industry.webp";

function About() {
  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* <div className="lg:col-span-7">
          <div className="grid grid-cols-12 gap-2 sm:gap-6 items-center lg:-translate-x-10">
            <div className="col-span-4">
              <img
                className="rounded-xl"
                src={kantImg}
                alt="Image Description"
                loading="lazy"
              />
            </div>

            <div className="col-span-3">
              <img
                className="rounded-xl"
                src={industry1Img}
                alt="Image Description"
                loading="lazy"
              />
            </div>

            <div className="col-span-5">
              <img
                className="rounded-xl"
                src={industry2Img}
                alt="Image Description"
                loading="lazy"
              />
            </div>
          </div>
        </div> */}

        <div className="lg:col-span-7 hidden lg:block">
          {/* <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-4">
              <img
                className="rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                src={kantImg}
                alt="Image Description"
                loading="lazy"
              />
            </div>
            <div className="col-span-3">
              <img
                className="rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                src={industry1Img}
                alt="Image Description"
                loading="lazy"
              />
            </div>
            <div className="col-span-5">
              <img
                className="rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                src={industry2Img}
                alt="Image Description"
                loading="lazy"
              />
            </div>
          </div> */}
        </div>

        <div className="lg:col-span-5">
          <div className="space-y-6 sm:space-y-8 text-gray-700 dark:text-gray-300">
            <div className="text-center sm:text-left space-y-4">
              <h1
                className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-gray-200 relative 
                inline-block transition-all duration-500 ease-in-out transform hover:scale-105"
              >
                About{" "}
                <span className="text-blue-600 dark:text-blue-400 drop-shadow-md">
                  IADA
                </span>
                <div
                  className="absolute -bottom-2 left-0 w-full h-1 bg-blue-500
                  transform scale-x-50 origin-center transition-all duration-500"
                ></div>
              </h1>
              <p className="text-justify text-lg font-medium px-4 sm:px-0">
                The IADA Baddi is the nodal agency for upkeep, development,
                cleanliness, sewerage management, drainage system, water supply,
                maintenance of greenery, and other common facilities in the
                industrial areas developed by the Department of Industries, H.P.
                in the Baddi-Barotiwala Area.
                <br />
                <br />
                Presently, 6 industrial areas—Baddi, Jhara Majri, Lodhi Majra,
                Thana, Barotiwala, and Katha—are being maintained/served by
                IADA, Baddi. It is a Non-profit society registered under the
                H.P. Societies Registration Act 2006.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
