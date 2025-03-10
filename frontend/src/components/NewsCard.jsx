import React, { useEffect, useState } from "react";
import { FaRegLightbulb } from "react-icons/fa";
import axios from "axios";
import Modal from "react-modal";
import headers from "../authIndex/headers";
function NewsCard() {
  const [newsData, setNewsData] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [newsTitle, setNewsTitle] = useState("");

  useEffect(() => {
    fetchNewsData();
  }, []);

  const fetchNewsData = () => {
    axios
      .get(`${import.meta.env.VITE_SERVER}/api/news/list`, headers)
      .then((response) => {
        setNewsData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching news data:", error);
      });
  };

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  const customStyles = {
    content: {
      top: "60%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      boxShadow: "0px 0px 7px",
      zIndex: "9999",
    },
  };

  return (
    <div className="pt-6 m-6 ">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="News Headline"
        ariaHideApp={false}
      >
        <div className=" flex justify-end items-center">
          <button
            className="p-2 bg-red-500 hover:bg-red-400 text-white rounded mb-2"
            onClick={closeModal}
          >
            close
          </button>
        </div>
        <h2 className="font-bold text-xl ">{newsTitle}</h2>
      </Modal>

      <div className="flex items-center justify-center mb-6">
        <FaRegLightbulb className="text-yellow-500 mr-2 text-3xl" />
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 text-center">
          News And Updates
        </h1>
      </div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {newsData.length > 0 ?  newsData.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105"
          >
            <div className="p-4 h-64 overflow-hidden">
              <h2
                onClick={() => {
                  setNewsTitle(item.title);
                  openModal();
                }}
                className="h-1/5 text-xl font-semibold text-gray-800 mb-1 overflow-ellipsis"
              >
                {item.title.length > 30
                  ? `${item.title.substring(0, 30)}...`
                  : item.title}
              </h2>
              <div className="h-3/5 text-gray-700 mb-1 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400">
                <p>{item.content}</p>
              </div>

              <div className="h-1/5 flex items-center justify-between text-gray-500 text-sm">
                <span>{item.date}</span>
              </div>
            </div>
          </div>
        )):null}
      </div>
    </div>
  );
}

export default NewsCard;
