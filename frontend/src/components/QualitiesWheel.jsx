import React from "react";

const QualitiesWheel = () => {
  return (
    <div className="h-[50rem] flex justify-center items-center m-8 rounded-lg">
      <div className="relative rounded-full flex justify-center items-center md:p-56">
        <div
          className="petal1 absolute bg-yellow-500 -top-[21rem] left-16 md:-top-8 md:left-80 md:h-[21rem] h-[24rem] rounded-tr-full md:w-[22rem] w-[11rem] flex justify-center items-center pl-0"
          style={{
            boxShadow: "0 0 1rem",
          }}
        >
          <div className="petal1-inner w-32 md:w-64 ml-2 md:-ml-14">
            <h3 className="font-bold underline">Tourism Attraction</h3>
            <ul className="text-sm text-wrap list-disc">
              <li>
                One of the most visited Indian Hill State by domestic and
                international tourists
              </li>
              <li>
                Tourism avenues like Adventure Tourism, Spiritual tourism & Eco
                Tourism
              </li>
              <li>Abode of His Holiness Dalai Lama at Dharamshala</li>
            </ul>
          </div>
        </div>
        <div
          className="petal2 absolute bg-red-500 top-12 left-20 md:left-80 md:top-72 md:h-[22rem] h-[24rem] rounded-br-full md:w-[23rem] w-[10rem] flex justify-center items-center pl-0"
          style={{
            boxShadow: "0 0 1rem",
          }}
        >
          <div className="petal2-inner w-28 md:w-60 ml-4">
            <h3 className="font-bold underline">Natural Utilities</h3>
            <ul className="text-sm text-wrap list-disc">
              <li>Adequate water resource owing to 5 perineal rivers</li>
              <li>
                Adequate and affordable Power (one of the lowest in the country)
              </li>
              <li>Peace loving, hardworking & law abiding citizens</li>
            </ul>
          </div>
        </div>
        {/* Center */}
        <div
          className="center border-2 bg-white border-black rounded-full w-28 h-28 md:w-48 md:h-44 text-center flex justify-center items-center p-4 z-50 ml-4"
          style={{
            boxShadow: "0 0 1rem",
          }}
        >
          <div className="inner-circle border-4 md:border-8 border-t-black border-r-green-600 border-b-yellow-400 border-l-red-500 rounded-full text-sm md:text-xl flex justify-center items-center uppercase text-center font-bold w-24 h-24 md:w-36 md:h-36">
            Rising Himachal
          </div>
        </div>
        <div
          className="petal3 absolute bg-gray-500 -left-28 top-12 md:left-0 md:top-72 md:h-[21rem] h-[25rem] rounded-bl-full md:w-[20rem] w-[12rem] flex justify-center items-center pl-0 text-white"
          style={{
            boxShadow: "-2px 1px 1rem black",
          }}
        >
          <div className="petal3-inner md:w-56 ml-8 -mt-12">
            <h3 className="font-bold underline">Skilled Manpower</h3>
            <ul className="text-sm text-wrap list-disc">
              <li>Higher literacy rate at 82.80% (National Rate 74%)</li>
              <li>
                Technical manpower - one of the highest in the country per
                million
              </li>
              <li>
                Adjudged as "Best State in Education, Infrastructure & Overall
                Development"
              </li>
            </ul>
          </div>
        </div>
        <div
          className="petal4 absolute bg-green-500 -left-28 -top-80 md:-left-4 md:-top-4 md:h-[19rem] h-[23rem] rounded-tl-full md:w-[21rem] w-[11rem] flex justify-center items-center pl-0 text-white text-center"
          style={{
            boxShadow: "-2px 1px 1rem black",
          }}
        >
          <div className="petal4-inner md:w-56 ml-6 md:ml-24 mt-6 text-black">
            <h3 className="font-bold underline mb-2 md:mb-0">
              Proactive Governance
            </h3>
            <ul className="text-sm text-wrap list-disc">
              <li>Simplified procedures backed with time bound approvals</li>
              <li>Proactive administration with progressive policies</li>
              <li>
                Acknowledged for "Good Governance Among Small States" by Public
                Affairs Centre 2018
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualitiesWheel;
