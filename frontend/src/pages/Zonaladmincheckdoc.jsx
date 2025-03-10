import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "tailwindcss/tailwind.css";
import Cookies from "universal-cookie";
import { FaCalendarAlt, FaSearch } from "react-icons/fa";
import Admindocumenttable from "./Admindocumenttable";
import AdminDashControl from "../components/ZonalAdminDashControl";

const Zonaladmincheckdoc = () => {
  const { zone_id } = useParams();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const cookies = new Cookies();
  const sidebarRef = useRef(null);
  const sideBarBtnRef = useRef(null);
  const [showControlPanel, setShowControlPanel] = useState(false);

  useEffect(() => {
    const fetchZoneBills = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER}/api/zAdmin/getdocument`,
          {
            headers: {
              Authorization: `Bearer ${cookies.get("token")}`,
            },
            params: { zone_id },
          }
        );
        setBills(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching zone bills:", error);
        setLoading(false);
      }
    };

    fetchZoneBills();
  }, [zone_id]);
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

  const handleDelete = (deletedIds) => {
    setBills(bills.filter((bill) => !deletedIds.includes(bill._id)));
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
      </div>
    );
  }

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
      <div className="container mx-auto">
        <div className="flex justify-center items-center gap-3 mb-6">
          <div className="mt-6 flex justify-center items-center gap-4">
            <h1 className="text-3xl font-bold text-blue-600 text-center w-1/2 md:w-full">
              {cookies.get("zone")} zone all Document{" "}
            </h1>
            <FaCalendarAlt className="text-blue-600 ml-2 text-2xl" />
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg">
          <Admindocumenttable bills={bills} onDelete={handleDelete} />
        </div>
      </div>
    </>
  );
};

export default Zonaladmincheckdoc;
