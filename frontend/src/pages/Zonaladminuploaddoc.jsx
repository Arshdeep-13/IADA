import React, { useState, useEffect, useRef } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import AdminDashControl from "../components/ZonalAdminDashControl";

const Zonaladminuploaddoc = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({
    documentName: null,
    documentUrl: null,
    documentType: null,
    size: null,
  });
  const [alldoc, setAllDoc] = useState([]);
  const [loading, setLoading] = useState(false);
  const sidebarRef = useRef(null);
  const sideBarBtnRef = useRef(null);
  const [showControlPanel, setShowControlPanel] = useState(false);

  useEffect(() => {
    fetchUploadedFiles();
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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    const validTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      // Alert user if the file type is not valid
      alert(
        "Invalid file type. Please upload a PDF or image file (JPG, JPEG, PNG)."
      );
      e.target.value = ""; // Clear the file input
    }
  };
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }
    const token = new Cookies().get("token");
    const zone_id = new Cookies().get("zone_id");
    const maxFileSize = 9 * 1024 * 1024; // 9 MB in bytes
    if (file && file.size > maxFileSize) {
      alert("File size exceeds 9 MB limit");
      return;
    } else {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("zoneId", zone_id);
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      try {
        setLoading(true);
        const data = await axios.post(
          `${import.meta.env.VITE_SERVER}/api/zAdmin/zadmin-uploaddoc`,
          formData,
          config
        );
        if (data.data.success) {
          toast.success("Uploaded Successfully");
        }
        fetchUploadedFiles();
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Failed to upload document");
        console.error(error);
      }
    }
  };
  const fetchUploadedFiles = async () => {
    try {
      const zone_id = new Cookies().get("zone_id");
      const data = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/zAdmin/getDocByZone`,
        {
          params: {
            zoneId: zone_id,
          },
        }
      );
      setAllDoc(data.data.data);
    } catch (error) {
      console.error("Error fetching uploaded files:", error);
      setLoading(false);
    }
  };
  const showPdf = (fileData, contentType) => {
    try {
      const byteArray = new Uint8Array(fileData.data);
      const blob = new Blob([byteArray], { type: contentType });
      const url = URL.createObjectURL(blob);
      window.open(url);
    } catch (error) {
      console.error("Error opening image:", error);
      toast.error("Failed to load image");
    }
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
      <div className="container mx-auto lg:p-12">
        <ToastContainer />
        {/* Upload Document Form */}
        <div className="mb-4">
          <label className="block mb-2">Upload New Document</label>
          <input type="file" onChange={handleFileChange} />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            onClick={handleUpload}
          >
            Upload
          </button>
          {error && <div className="text-red-500">{error}</div>}
        </div>

        {/* Display Uploaded Files */}
        <div>
          <h2 className="text-lg font-bold mb-2">Uploaded Files</h2>
          {loading && (
            <div className="text-gray-500">
              <div
                className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
                role="status"
                aria-label="loading"
              >
                <span className="sr-only"></span>
              </div>
            </div>
          )}
          {!loading && alldoc.length > 0 ? (
            <ul>
              {alldoc.map((url, index) => (
                <div
                  key={index}
                  className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-md mb-4"
                >
                  <div className="mb-2 flex justify-between items-center">
                    <div className="flex items-center gap-x-3">
                      <span className="size-8 flex justify-center items-center border border-gray-200 text-gray-500 rounded-lg dark:border-neutral-700 dark:text-neutral-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          width="100"
                          height="100"
                          viewBox="0 0 48 48"
                        >
                          <path
                            fill="#50e6ff"
                            d="M39,16v25c0,1.105-0.895,2-2,2H11c-1.105,0-2-0.895-2-2V7c0-1.105,0.895-2,2-2h17L39,16z"
                          ></path>
                          <linearGradient
                            id="F8F33TU9HxDNWNbQYRyY3a_XWoSyGbnshH2_gr1"
                            x1="28.529"
                            x2="33.6"
                            y1="15.472"
                            y2="10.4"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop offset="0" stopColor="#3079d6"></stop>
                            <stop offset="1" stopColor="#297cd2"></stop>
                          </linearGradient>
                          <path
                            fill="url(#F8F33TU9HxDNWNbQYRyY3a_XWoSyGbnshH2_gr1)"
                            d="M28,5v9c0,1.105,0.895,2,2,2h9L28,5z"
                          ></path>
                        </svg>
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          {url.docname}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-neutral-500">
                          {url.documentType} - {url.size} bytes
                        </p>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-x-2">
                      <svg
                        className="flex-shrink-0 size-4 text-teal-500"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>
                      </svg>
                      <a
                        onClick={() =>
                          showPdf(url.documentUrl, url.documentType)
                        }
                        className="text-gray-500 hover:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-200"
                        rel="noopener noreferrer"
                        download
                        target="_blank"
                        style={{ marginLeft: "10px" }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 15l-6-6h4V3h4v6h4l-6 6z" />
                          <path d="M0 0h24v24H0z" fill="none" />
                        </svg>
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-x-3 whitespace-nowrap">
                    <div
                      className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700"
                      role="progressbar"
                      aria-valuenow="100"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <div
                        className="flex flex-col justify-center rounded-full overflow-hidden bg-teal-500 text-xs text-white text-center whitespace-nowrap transition duration-500"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                    <div className="w-6 text-end">
                      <span className="text-sm text-gray-800 dark:text-white">
                        100%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </ul>
          ) : (
            !loading && <p>No files uploaded yet.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Zonaladminuploaddoc;
