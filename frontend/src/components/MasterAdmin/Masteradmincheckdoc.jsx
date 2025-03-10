import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css";
import Cookies from "universal-cookie";
import { FaCalendarAlt } from "react-icons/fa";
import Madmindoctable from "./Madmindoctable";
import MasterAdminDashControl from "../MasterAdminDashControl";
import NewAlertModal from "../NewAlertModal";

const Masteradmincheckdoc = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredBills, setFilteredBills] = useState([]);
  const [selectedZone, setSelectedZone] = useState("");
  const cookies = new Cookies();
  const [showControlPanel, setShowControlPanel] = useState(false);
  const sidebarRef = useRef(null);
  const sideBarBtnRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const zoneNames = ["Baddi", "Lodhimajra", "Katha", "Thana", "ZONE 6"];

  useEffect(() => {
    const fetchZoneBills = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER}/api/zAdmin/mAdmin/getdocument`,
          {
            headers: {
              Authorization: `Bearer ${cookies.get("token")}`,
            },
          }
        );
        setBills(response.data.data);
        setFilteredBills(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching zone bills:", error);
        setLoading(false);
      }
    };

    fetchZoneBills();
  }, []);

  const handleDelete = (deletedIds) => {
    setFilteredBills(
      filteredBills.filter((bill) => !deletedIds.includes(bill._id))
    );
  };
  const handleZoneChange = (event) => {
    const zone = event.target.value.toLowerCase();
    setSelectedZone(zone);
    if (zone === "") {
      setFilteredBills(bills);
    } else {
      const filtered = bills.filter((bill) =>
        bill.zonename.toLowerCase().includes(zone)
      );
      setFilteredBills(filtered);
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
      </div>
    );
  }
  const handleControlClick = () => {
    setShowControlPanel(!showControlPanel);
  };
  const addUpdate = (newUpdate) => {
    axios
      .post(`${import.meta.env.VITE_SERVER}/api/news/add`, newUpdate, {
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
        },
      })
      .then((response) => {
        if (response.status === 201) {
          toast.success("Update added successfully", toastOptions);
        }
      })
      .catch((error) => {
        toast.error(
          "Error adding update. Please try again later.",
          toastOptions
        );
        console.error("Error adding update:", error);
      });
  };

  return (
    <>
      <div className="mt-4">
        <button
          id="toggle-button"
          ref={sideBarBtnRef}
          onClick={handleControlClick}
          className="p-2 bg-blue-600 text-white rounded-full shadow-lg sticky top-28 left-4 z-50 flex items-center justify-center transition-transform transform hover:scale-110"
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
          className={` border-b-2 absolute top-0 left-0 h-full bg-white pt-20 md:pt-28 z-30 transition-transform duration-500 ease-in-out ${
            showControlPanel
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0"
          }`}
          ref={sidebarRef}
        >
          <MasterAdminDashControl
            setShowModal={setShowModal}
            setShowControlPanel={setShowControlPanel}
          />
        </div>
        <div className={`p-6 space-y-6 ${showControlPanel ? "blur-sm" : ""}`}>
          {showModal && (
            <NewAlertModal
              showModal={showModal}
              setShowModal={setShowModal}
              addUpdate={addUpdate}
            />
          )}
        </div>
      </div>
      <div className="container mx-auto">
        <div className="mt-6 flex justify-center items-center gap-3 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-600 flex items-center capitalize">
            {cookies.get("zone")} zone all Document{" "}
          </h1>
          <FaCalendarAlt className="text-blue-600 ml-2 text-xl" />
        </div>
        <div className="flex flex-wrap gap-5 md:gap-0 justify-center items-center mb-6 mt-3">
          <h2 className="text-lg font-medium mr-4 text-center">
            Sort By Zone Name
          </h2>
          <select
            value={selectedZone}
            onChange={handleZoneChange}
            className="border border-gray-300 rounded-lg p-2 w-64"
          >
            <option value="">All Zones</option>
            {zoneNames.map((zone, index) => (
              <option key={index} value={zone.toLowerCase()}>
                {zone}
              </option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto rounded-lg">
          <Madmindoctable bills={filteredBills} onDelete={handleDelete} />
        </div>
      </div>
    </>
  );
};

export default Masteradmincheckdoc;
