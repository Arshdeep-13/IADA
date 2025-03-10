import React from "react";
import img from "../assets/webpImages/banner-image.webp";

const AboutCard = ({ name, designation, department, contact, imgUrl }) => {
  return (
    <div className=" bg-gray-300 rounded-lg w-64">
      <img
        src={imgUrl ? imgUrl : img}
        className="w-64 rounded-lg rounded-b-none mb-2"
        alt="Sample image"
      />
      <div className="mb-2 flex flex-col pt-0 p-5">
        <h1 className="font-semibold md:text-xl text-base">{name}</h1>
        <p className="font-semibold text-justify">{designation}</p>
        <p className="font-semibold text-justify">{department}</p>
        <p className="font-semibold text-justify">{contact}</p>
      </div>
    </div>
  );
};

export default AboutCard;
