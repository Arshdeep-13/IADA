import React, { useEffect, useState } from "react";
import mountain from "../assets/webpImages/mountain.webp";
import mount2 from "../assets/webpImages/mount2.webp";
import village from "../assets/webpImages/village.webp";
import lion from "../assets/NavLogo/government-of-india.webp";
import AboutCard from "../components/AboutCard";

const About = () => {
  const [bannerUrl, setBannerUrl] = useState(mountain);
  const [cardIndex, setCardIndex] = useState(0);
  const [showCardIdx, setShowCardIdx] = useState(4);
  const cards = [
    {
      name: "Sanjay Chauhan",
      designation: "IA  baddi & Lodhi Majra",
      department: "SWCA",
      contact: "9805863010",
    },
    {
      name: "Dalip sharma",
      designation: "IA Katha & Jhara Majri",
      department: "SWCA",
      contact: "9816131326",
    },
    {
      name: "Suresh Kumar",
      designation: "IA, barotiwala",
      department: "SWCA",
      contact: "894053305",
    },
    {
      name: "Ashwini Kumar",
      designation: "IA, Thana",
      department: "SWCA",
      contact: "8219034807",
    },
    {
      name: "Balwinder Thakur",
      designation: "IA, Jhara Majri",
      department: "SWCA",
      contact: "9779721434",
    },
  ];

  useEffect(() => {
    const images = [mountain, mount2, village];
    let i = 0;
    const timer = setInterval(() => {
      setBannerUrl(images[i]);
      i = (i + 1) % images.length;
    }, 3000);

    const resizer = window.addEventListener("resize", () => {
      if (window.innerWidth < 800) {
        setShowCardIdx(1);
      } else {
        setShowCardIdx(4);
      }
    });

    return () => {
      clearInterval(timer);
      window.removeEventListener("resize", resizer);
    };
  }, []);

  const handlePrevClickLarge = () => {
    let newIdx = cardIndex - 1;
    if (newIdx < 0) {
      newIdx = cards.length - 4;
    }
    setCardIndex(newIdx);
  };
  const handleNextClickLarge = () => {
    let newIdx = cardIndex + 1;
    if (newIdx >= cards.length - 3) {
      newIdx = 0;
    }
    setCardIndex(newIdx);
  };
  const handlePrevClickSmall = () => {
    let newIdx = cardIndex - 1;
    if (newIdx < 0) {
      newIdx = cards.length - 1;
    }
    setCardIndex(newIdx);
  };
  const handleNextClickSmall = () => {
    let newIdx = cardIndex + 1;
    if (newIdx >= cards.length) {
      newIdx = 0;
    }
    setCardIndex(newIdx);
  };

  return (
    <>
      <section className="relative ">
        <div className="left absolute flex flex-col justify-center items-center h-auto min-h-screen z-50 gap-5 sm:mt-14">
          <h1 className="font-bold md:text-4xl text-3xl text-white">
            About IADA Baddi
          </h1>
          <p className="w-4/5 font-semibold md:text-xl text-justify md:ml-40 md:mr-40 text-white ml-10 mr-10 text-lg">
            IADA Baddi is a semi-government entity in Himachal Pradesh, India,
            focused on the industrial development of the
            Baddi-Barotiwala-Nalagarh area. It facilitates infrastructure,
            resources, and regulatory support to industries, promoting growth
            and sustainability in the region. IADA Baddi plays a crucial role in
            boosting local economic development. The IADA Baddi is the nodal
            agency for upkeep, development, cleanliness, sewerage management,
            drainage system, water supply, maintenance of greenery and other
            common facilities in the industrial areas developed by the
            Department of Industries, H.P. in the Baddi- Barotiwala Area.
            Presently 6 industrial areas namely Baddi, Jhara Majri, Lodhi Majra,
            Thana, Barotiwala, Katha are being maintained/ served by IADA,
            Baddi. It is a Non-profit society registered under the H.P.
            Societies Registration Act 2006.
          </p>
        </div>
        <div className="right transition-all duration-300 ease-in-out">
          <img
            src={bannerUrl}
            className="w-full h-screen object-cover brightness-50 transition-opacity duration-300 ease-in-out"
            alt="Himachal Pradesh scenes"
          />
        </div>
      </section>

      <section className="relative mt-10 bg-gray-100 p-6 gap-10 flex flex-col justify-center items-center">
        <div className="upper flex justify-center items-center gap-5">
          <img src={lion} className="w-20" alt="Logo" />
          <h2 className="font-bold md:text-3xl text-2xl">Who's Who</h2>
        </div>

        {/* LARGE SCREENS */}
        <div className="hidden md:flex lower gap-10 justify-center items-center w-full relative">
          <button
            className="absolute left-2 md:left-5 bg-blue-500 hover:bg-blue-400 p-2 md:p-3 rounded-full text-white hover:scale-110 transition-all ease-in-out duration-300"
            onClick={handlePrevClickLarge}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          {cards
            .slice(cardIndex, cardIndex + showCardIdx)
            .map((card, index) => (
              <AboutCard
                key={index}
                name={card.name}
                designation={card.designation}
                department={card.department}
                contact={card.contact}
              />
            ))}
          <button
            className="absolute right-2 md:right-5 bg-blue-500 hover:bg-blue-400 p-2 md:p-3 rounded-full text-white hover:scale-110 transition-all ease-in-out duration-300"
            onClick={handleNextClickLarge}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>

        {/* SMALL SCREENS */}
        <div className="flex md:hidden lower gap-5 justify-center items-center w-full relative">
          <button
            className="absolute left-2 bg-blue-500 hover:bg-blue-400 p-2 rounded-full text-white hover:scale-110 transition-all ease-in-out duration-300"
            onClick={handlePrevClickSmall}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          {cards
            .slice(cardIndex, cardIndex + showCardIdx)
            .map((card, index) => (
              <AboutCard
                key={index}
                name={card.name}
                designation={card.designation}
                department={card.department}
                contact={card.contact}
              />
            ))}
          <button
            className="absolute right-2 bg-blue-500 hover:bg-blue-400 p-2 rounded-full text-white hover:scale-110 transition-all ease-in-out duration-300"
            onClick={handleNextClickSmall}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </section>
    </>
  );
};

export default About;
