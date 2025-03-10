import React, { useState, useEffect } from "react";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

const ZonaladminconsImage = ({ val, handleClose }) => {
  const [imageUrls, setImageUrls] = useState([{}]);

  useEffect(() => {
    const urls = val.images.map((image) =>
      handleImg(image.data.data, image.contentType)
    );
    setImageUrls(urls);
  }, [val.images]);

  const handleImg = (fileData, contentType) => {
    try {
      const byteArray = new Uint8Array(fileData);
      const blob = new Blob([byteArray], { type: contentType });
      const url = URL.createObjectURL(blob);
      return url;
    } catch (error) {
      console.error("Error opening image:", error);
      return null;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full bg-white p-4 rounded shadow-lg max-w-lg overflow-y-auto relative">
        <button
          className="bg-red-500 mb-4 text-white absolute top-4 right-4 p-2 rounded hover:bg-red-400"
          onClick={handleClose}
        >
          Close
        </button>
        <div className="slide-container mt-10">
          <Slide>
            {imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Slide ${index}`}
                className="h-96 w-full object-contain"
                loading="lazy"
              />
            ))}
          </Slide>
        </div>
        <span className="flex justify-center items-center font-bold text-justify mt-2">
          Image Description : {val.description}
        </span>
      </div>
    </div>
  );
};

export default ZonaladminconsImage;
