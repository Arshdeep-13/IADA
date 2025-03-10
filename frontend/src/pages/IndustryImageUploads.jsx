import React, { useRef, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const IndustryImageUpload = () => {
  const cookies = new Cookies();
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [progressBar, setProgressBar] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const dropzoneRef = useRef(null);

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const industry_id = cookies.get("email");
    const zone_id = cookies.get("zone_id");

    if (!industry_id || !zone_id) {
      alert("Kindly login and allow cookies");
      return;
    }

    if (images.length === 0 || description.length === 0) {
      toast.error("Please fill all the entries", {
        position: "top-left",
        autoClose: 1100,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    const formData = new FormData();
    formData.append("description", description);
    formData.append("industry_id", industry_id);
    formData.append("zone_id", zone_id);
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/industry/upload-images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${cookies.get("token")}`,
          },
          onUploadProgress: (e) => {
            setProgressBar(Math.round((100 * e.loaded) / e.total));
          },
        }
      );
      toast.success(response.data.message, {
        position: "top-left",
        autoClose: 1100,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setImages([]);
      setDescription("");
    } catch (error) {
      toast.error(error.message, {
        position: "top-left",
        autoClose: 1100,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  return (
    <div className="flex items-center justify-center">
      <ToastContainer
        position="top-left"
        autoClose={1100}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="mx-auto w-full max-w-[550px] bg-white">
        <form className="py-4 px-9" onSubmit={handleSubmit}>
          <div className="mb-6 pt-4">
            <label className="mb-5 block text-xl font-semibold text-[#07074D]">
              Upload Images
            </label>

            <div className="mb-5">
              <input
                type="file"
                id="file"
                className="sr-only"
                multiple
                onChange={handleFileChange}
              />
              <label
                htmlFor="file"
                className={`relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed ${
                  isDragOver ? "border-blue-500" : "border-[#e0e0e0]"
                } p-12 text-center`}
                ref={dropzoneRef}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div>
                  <span className="mb-2 block text-xl font-semibold text-[#07074D]">
                    Drag & Drop Images ( max 5 )
                  </span>
                  <span className="mb-2 block text-base font-medium text-[#6B7280]">
                    Or
                  </span>
                  <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
                    Browse
                  </span>
                </div>
              </label>
            </div>

            <div>
              {images.length > 0 && (
                <div className="mb-5">
                  {images.map((file, index) => (
                    <div
                      key={index}
                      className="rounded-md bg-[#F5F7FB] py-4 px-8 mb-3 flex items-center justify-between"
                    >
                      <span className="truncate pr-3 text-base font-medium text-[#07074D]">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        className="text-[#07074D]"
                        onClick={() => {
                          const newImages = images.filter(
                            (_, i) => i !== index
                          );
                          setImages(newImages);
                        }}
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M0.279337 0.279338C0.651787 -0.0931121 1.25565 -0.0931121 1.6281 0.279338L9.72066 8.3719C10.0931 8.74435 10.0931 9.34821 9.72066 9.72066C9.34821 10.0931 8.74435 10.0931 8.3719 9.72066L0.279337 1.6281C-0.0931125 1.25565 -0.0931125 0.651788 0.279337 0.279338Z"
                            fill="currentColor"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M0.279337 9.72066C-0.0931125 9.34821 -0.0931125 8.74435 0.279337 8.3719L8.3719 0.279338C8.74435 -0.0931127 9.34821 -0.0931123 9.72066 0.279338C10.0931 0.651787 10.0931 1.25565 9.72066 1.6281L1.6281 9.72066C1.25565 10.0931 0.651787 10.0931 0.279337 9.72066Z"
                            fill="currentColor"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-5">
              <label
                htmlFor="description"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Description:
              </label>
              <textarea
                id="description"
                value={description}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:to-blue-500 focus:shadow-md"
                placeholder="Enter description"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="hover:bg-blue-400 w-full rounded-md bg-blue-500 py-3 px-8 text-center text-base font-semibold text-white outline-none"
            >
              Send File
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IndustryImageUpload;
