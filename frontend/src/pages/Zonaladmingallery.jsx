import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import Cookies from "universal-cookie";
import ZonaladminconsImage from "./ZonaladminconsImage";
import { FaSearch } from "react-icons/fa";
import RingLoader from "react-spinners/RingLoader";
import AdminDashControl from "../components/ZonalAdminDashControl";

const Zonaladmingallery = () => {
  const cookies = new Cookies();
  const token = cookies.get("token");
  const [data, setData] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [imageModalData, setImageModalData] = useState({});
  const [imageUrls, setImageUrls] = useState([{}]);
  const [loading, setLoading] = useState(false);
  const [noImages, setNoImages] = useState(true);
  const [contentLoad, setContentLoad] = useState(false);
  const sidebarRef = useRef(null);
  const sideBarBtnRef = useRef(null);
  const [showControlPanel, setShowControlPanel] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    if (showControlPanel) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showControlPanel]);

  const fetchData = async () => {
    try {
      const zoneId = cookies.get("zone_id");
      setContentLoad(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/zAdmin/get-industry-images`,
        {
          params: {
            zoneId: zoneId,
          },
        }
      );
      if (response.data.data === 0) {
        alert("Something went wrong! Please try again later.");
        return;
      }
      setContentLoad(false);
      setData(response.data.data);
      response.data.data.reverse();
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };
  const handleShowImage = (val) => {
    setCurrentImage(val);
    setIsModalOpen(true);
  };
  const handleClose = () => {
    setIsModalOpen(false);
    setCurrentImage(null);
  };
  const handleEdit1 = (val) => {
    const data = val.images.filter((image) => !image.isAccepted);
    setImageModalData(val);
    setEditModal(true);
    const urls = val.images.map((image) =>
      handleImg(image.data.data, image.contentType)
    );
    setImageUrls(urls);
    setNoImages(data.length === 0); // Check if there are no images to approve
  };
  const handleImg = (fileData, contentType) => {
    try {
      const byteArray = new Uint8Array(fileData);
      const blob = new Blob([byteArray], { type: contentType });
      const url = URL.createObjectURL(blob);
      return url;
    } catch (error) {
      alert("Error opening image:", error);
      return null;
    }
  };
  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  const handleModalClose = () => {
    setEditModal(false);
  };
  const deleteImage = async (val) => {
    try {
      setLoading(true);
      const dataVal = {
        imgId: val,
        industry_id: imageModalData.industry_id,
      };
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const data = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/zAdmin/deletetheimage`,
        dataVal,
        config
      );
      if (data.data.data === 0) {
        alert("Something went wrong! Please try again later");
        return;
      }
      setLoading(false);
      setEditModal(false);
      fetchData();
    } catch (e) {
      setLoading(false);
      alert("Network Error");
      console.log(e);
    }
  };
  const handleEdit = async (val) => {
    try {
      setLoading(true);
      const dataVal = {
        imgId: val,
        industry_id: imageModalData.industry_id,
      };
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const data = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/zAdmin/update-image-status`,
        dataVal,
        config
      );
      if (data.data.data === 0) {
        alert("Something went wrong! Please try again later.");
        return;
      }
      setLoading(false);
      setEditModal(false);
      fetchData();
    } catch (error) {
      setLoading(false);
      alert("Network Error");
      console.log("Error" + error);
    }
  };
  const divStyle = {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    backgroundSize: "cover",
    height: "200px",
    width: "100%",
    padding: "5px",
  };
  const override = {
    display: "block",
    margin: "0 auto",
  };
  const handleControlClick = () => {
    setShowControlPanel(!showControlPanel);
  };
  const handleClickOutside = (e) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(e.target) &&
      e.target.id !== "toggle-button"
    ) {
      setShowControlPanel(false);
    }
  };

  return (
    <>
      <div className="flex p-4 mb-10">
        <button
          ref={sideBarBtnRef}
          onClick={handleControlClick}
          id="toggle-button"
          className="p-2 bg-blue-600 text-white rounded-full sticky left-4 z-50 top-28 flex items-center justify-center transition-transform transform hover:scale-110"
        >
          {showControlPanel ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          )}
          Control Panel
        </button>
        <div
          className={`border-b-2 absolute top-0 left-0 h-full pt-24 md:pt-28 overflow-x-hidden bg-white z-30 transition-transform duration-500 ease-in-out ${
            showControlPanel
              ? "translate-x-0 opacity-100 w-64"
              : "-translate-x-full opacity-0 w-0"
          }`}
          ref={sidebarRef}
        >
          <AdminDashControl />
        </div>
      </div>
      <div className="relative mx-auto w-full md:w-1/2 lg:w-1/3">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 mt-5" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg m-14">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Industry Name
              </th>
              <th scope="col" className="px-6 py-3">
                Images
              </th>
              <th scope="col" className="px-6 py-3">
                Edit
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((val, idx) => (
                <tr
                  key={idx}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {val.industry_id}
                  </th>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleShowImage(val)}
                      className="text-blue-600 hover:underline"
                    >
                      Show Image
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEdit1(val)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="font-bold text-center py-4">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {contentLoad ? (
          <RingLoader
            cssOverride={override}
            loading={contentLoad}
            color="#2980b9"
            size={150}
          />
        ) : null}

        {isModalOpen && currentImage && (
          <ZonaladminconsImage val={currentImage} handleClose={handleClose} />
        )}

        {editModal && (
          <div
            id="popup-modal"
            tabIndex="-1"
            className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50"
          >
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button
                type="button"
                className="absolute top-3 right-3 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={handleModalClose}
              >
                <span className="sr-only">Close modal</span>
              </button>
              <div className="flex flex-col-reverse">
                <div
                  className="flex justify-center items-center gap-4 flex-wrap py-3"
                  // style={{
                  //   width: "41rem",
                  // }}
                >
                  {noImages && (
                    <div className="flex items-center justify-center w-full">
                      <span className="text-center font-bold">
                        No images to approve
                      </span>
                    </div>
                  )}
                  {imageUrls.map((url, index) => (
                    <div
                      className="flex flex-col items-center justify-center"
                      key={index}
                    >
                      {!imageModalData.images[index].isAccepted ? (
                        <>
                          <div className="flex flex-col items-center">
                            <img
                              src={url}
                              alt={`Slide ${index}`}
                              style={{ ...divStyle }}
                              className="rounded-lg"
                              loading="lazy"
                            />
                            <button
                              type="button"
                              className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 mt-2"
                              onClick={() =>
                                handleEdit(imageModalData.images[index]._id)
                              }
                            >
                              Accept Image
                            </button>
                            <button
                              type="button"
                              className="text-white bg-red-500 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 mt-2"
                              onClick={() =>
                                deleteImage(imageModalData.images[index]._id)
                              }
                            >
                              Delete Image
                            </button>
                          </div>
                        </>
                      ) : null}
                    </div>
                  ))}
                </div>
                <div className="p-4 md:p-5 pb-0 md:pb-0 text-end">
                  <button
                    type="button"
                    className="bg-red-500 hover:bg-red-400 py-2.5 px-5 ml-3 text-sm font-medium focus:outline-none rounded-lg border border-gray-200  hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 text-white"
                    onClick={handleModalClose}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Zonaladmingallery;
