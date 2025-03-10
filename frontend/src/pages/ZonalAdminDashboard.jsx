import React, { useEffect, useRef, useState } from "react";
import AdminDashControl from "../components/ZonalAdminDashControl";
import ZoneInfo from "../components/ZoneInfo";
import RegisteredIndustryTable from "../components/RegisteredIndustryTable";
import UnRegisteredIndustryTable from "../components/UnRegisteredIndustryTable";
import { FaComment } from "react-icons/fa";
import FabButton from "../components/FABbutton";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import axios from "axios";

function ZonalAdminDashboard() {
  const [showControlPanel, setShowControlPanel] = useState(false);
  const cookies = new Cookies();
  const sidebarRef = useRef(null);
  const sideBarBtnRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const nav = useNavigate();
  const zone_id2 = cookies.get("zone_id");

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

  useEffect(() => {
    const fetchAlertsSummary = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER}/api/news/admin-alerts-summary/${zone_id2}`
        );
        if (response && response.data) {
          setUnreadCount(response.data.numUnreadAlerts);
        }
      } catch (error) {
        if (error.response) {
          console.error("Error fetching alerts summary:", error.response.data.message || error.message);
        } else {
          console.error("Error fetching alerts summary:", error.message);
        }
      }
    };
  
    // Ensure zone_id2 is not undefined or null
    if (zone_id2) {
      fetchAlertsSummary();
    }
  }, [zone_id2]);
  


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        sideBarBtnRef.current.classList.add("top-4");
        sideBarBtnRef.current.classList.remove("top-28");
      } else {
        sideBarBtnRef.current.classList.add("top-28");
        sideBarBtnRef.current.classList.remove("top-4");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  
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

  const handleFabZonalClick = () => {
    nav(`/zonal-alerts`);
  };

  return (
    <div className="relative w-full min-h-screen bg-gray-100">
      <FabButton
        onClick={handleFabZonalClick}
        icon={<FaComment />}
        badgeCount={unreadCount}
      />
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
        className={`border-b-2 absolute top-0 left-0 h-full overflow-x-hidden bg-white z-30 transition-transform duration-500 ease-in-out ${
          showControlPanel
            ? "translate-x-0 opacity-100 w-64"
            : "-translate-x-full opacity-0 w-0"
        }`}
        ref={sidebarRef}
      >
        <AdminDashControl />
      </div>

      <div className={`p-6 space-y-6 ${showControlPanel ? "blur-sm" : ""}`}>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <ZoneInfo />
        </div>
        {localStorage.getItem("registeredRender") === "true" && (
          <RegisteredIndustryTable />
        )}
        {localStorage.getItem("unregisteredRender") === "true" && (
          <UnRegisteredIndustryTable />
        )}
      </div>
    </div>
  );
}

export default ZonalAdminDashboard;
