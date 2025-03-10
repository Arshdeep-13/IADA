import React, { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaExclamationCircle, FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import xlsx from "json-as-xlsx";
import { useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import AdminDashControl from "../components/ZonalAdminDashControl";

const ZonalAdminBills = () => {
  const [dragOver, setDragOver] = useState(false);
  const cookie = new Cookies();
  const sidebarRef = useRef(null);
  const sideBarBtnRef = useRef(null);
  const { zone_id } = useParams();
  const [showControlPanel, setShowControlPanel] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  const generateExcelData = (industries) => [
    {
      sheet: "Industry_Details",
      columns: [
        { label: "date", value: "" }, //date has to be fetched form the scheduler for the upcoming bill gen date.
        { label: "consumerNo", value: "consumerNo" },
        { label: "meterNo", value: "meterNo" },
        { label: "consumerName", value: "name" },
        { label: "premises", value: "plot_number" },
        { label: "startRangeMeterReading", value: "" },
        { label: "endRangeMeterReading", value: "" },
        { label: "readingsFrom", value: "" },
        { label: "readingsTo", value: "" },
        { label: "sewageCharges", value: "" },
      ],
      content: industries.map((industry) => ({
        name: industry.name,
        plot_number: industry.plot_number,
        meterNo: industry.meterNo,
        consumerNo: industry.consumerNo,
      })),
    },
  ];

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(false);
    const files = event.dataTransfer.files;
    if (files.length) {
      uploadFile(files[0]);
    }
  };

  const fetchTemplate = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/industry/zoned-with-meter`,
        { zone_id },
        {
          headers: {
            authorization: `Bearer ${cookie.get("token")}`,
          },
        }
      );

      // Generate Excel data after setting the state
      const data = generateExcelData(response.data);
      const settings = {
        fileName: `${cookie.get("zone")}_Bill_Template`,
      };
      xlsx(data, settings);
      toast.success("Template exported successfully!");
    } catch (error) {
      console.error("Error fetching industry data:", error);
      toast.error("Failed to fetch industry data.");
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const uploadFile = (file) => {
    const zoneId = cookie.get("zone_id");
    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("zoneId", zoneId);

    formData.encType = "multipart/form-data";

    fetch(`${import.meta.env.VITE_SERVER}/api/zAdmin/getIndustryWaterBill`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${cookie.get("token")}`,
      },
      body: formData,
    })
      .then((response) =>
        response.json().then((data) => ({ status: response.status, data }))
      )
      .then(({ status, data }) => {
        if (status === 400 || status === 500) {
          toast.error(data.message, {
            icon: (
              <FaExclamationCircle
                style={{ color: "red", fontSize: "3.5em" }}
              />
            ),
            autoClose: 2100,
          });
          setTimeout(() => {
            window.history.back();
          }, 3000);
        } else if (status === 200) {
          toast.success(data.message, {
            icon: (
              <FaCheckCircle style={{ color: "green", fontSize: "3.5em" }} />
            ),
            autoClose: 2100,
          });
          setTimeout(() => {
            window.history.back();
          }, 5000);
        }
      })
      .catch((error) => {
        toast.error("An error occurred", {
          icon: (
            <FaExclamationCircle style={{ color: "red", fontSize: "3.5em" }} />
          ),
          autoClose: 2100,
        });
        console.error("Error:", error);
      });
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
      <div className="flex flex-col justify-center items-center gap-5 h-96">
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
        />
        <div className="flex gap-8">
          <h3 className="text-3xl font-bold dark:text-white text-center">
            Get your Area's Water Bill Template Here
          </h3>
          <button
            onClick={fetchTemplate}
            disabled={loading}
            className="bg-blue-600 rounded-md py-2 px-4 text-white font-semibold"
          >
            {loading ? "Loading..." : "Get Template"}
          </button>
        </div>
        <h2 className="text-xl font-bold dark:text-white">
          Upload the filled Excel file by clicking below
        </h2>
        <form
          onSubmit={(e) => e.preventDefault()}
          encType="multipart/form-data"
        >
          <div
            className={`flex items-center justify-center w-screen ${
              dragOver ? "border-blue-500 bg-gray-100" : ""
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Excel files only
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                name="avatar"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </form>
      </div>
    </>
  );
};

export default ZonalAdminBills;
