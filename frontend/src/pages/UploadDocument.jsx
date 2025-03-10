import React, { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import { toast } from "react-toastify";

const UploadDocument = () => {
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

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }
    const token = new Cookies().get("token");

    const validTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      alert(
        "Invalid file type. Please upload a PDF or image file (JPG, JPEG, PNG)."
      );
      event.target.value = "";
    } // Clear the file input
    const maxFileSize = 6 * 1024 * 1024; // 6 MB in bytes
    if (file && file.size > maxFileSize) {
      alert("File size exceeds 6 MB limit");
      return;
    } else {
      const formData = new FormData();
      formData.append("file", file);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      try {
        setLoading(true);
        const data = await axios.post(
          `${import.meta.env.VITE_SERVER}/api/industry/upload`,
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
      const token = new Cookies().get("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const data = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/industry/getdocByIndustry`,
        config
      );
      setAllDoc(data.data.data);
    } catch (error) {
      console.error("Error fetching uploaded files:", error);
      setLoading(false);
    }
  };

  const showPdf = (fileData, contentType) => {
    try {
      // Decode base64 data
      const binaryString = window.atob(fileData);
      const byteArray = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([byteArray], { type: contentType });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error opening image:", error);
      toast.error("Failed to load image");
    }
  };

  return (
    <div className="container mx-auto p-6 lg:p-12 bg-gray-100 rounded-lg shadow-md dark:bg-neutral-900">
      {/* Upload Document Form */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
          Upload New Document
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf, .jpg, .jpeg, .png"
          className="block w-full text-sm text-gray-900 border-gray-300  cursor-pointer dark:text-gray-400 focus:outline-none dark:border-gray-600 dark:placeholder-gray-400"
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-600 transition duration-300"
          onClick={handleUpload}
        >
          Upload
        </button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>

      {/* Display Uploaded Files */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Uploaded Files
        </h2>
        {loading && (
          <div className="text-gray-500">
            <div
              className="animate-spin inline-block w-6 h-6 border-4 border-current border-t-transparent text-blue-600 rounded-full"
              role="status"
              aria-label="loading"
            >
              <span className="sr-only">Loading...</span>
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
                    <span className="w-8 h-8 flex justify-center items-center border border-gray-200 text-gray-500 rounded-lg dark:border-neutral-700 dark:text-neutral-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        className="w-6 h-6"
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
                      className="flex-shrink-0 w-4 h-4 text-teal-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>
                    </svg>
                    <a
                      onClick={() => showPdf(url.documentUrl, url.documentType)}
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
          !loading && (
            <p className="text-gray-700 dark:text-gray-300">
              No files uploaded yet.
            </p>
          )
        )}
      </div>

      {/* Back Button */}
      <button
        type="button"
        onClick={() => history.back()}
        className="mt-4 bg-blue-500 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-600 transition-transform transform hover:scale-105"
      >
        Back
      </button>
    </div>
  );
};

export default UploadDocument;
