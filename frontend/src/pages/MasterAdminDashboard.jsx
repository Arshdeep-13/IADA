import React, { useEffect, useRef, useState } from "react";
import NewsCard from "../components/NewsCard";
import MasterAdminDashControl from "../components/MasterAdminDashControl";
import MasterDashDetails from "../components/MasterDashDetails";
import NewAlertModal from "../components/NewAlertModal";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "universal-cookie";

function MasterAdminDashboard() {
  const cookies = new Cookies();
  const [showControlPanel, setShowControlPanel] = useState(false);
  const sidebarRef = useRef(null);
  const sideBarBtnRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

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
  const toastOptions = {
    position: "top-left",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
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
    <div className="relative w-full min-h-screen bg-gray-100">
      <ToastContainer />

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
        className={` border-b-2 absolute top-0 left-0 h-full bg-white pt-2 z-30 transition-transform duration-500 ease-in-out ${
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
        <MasterDashDetails />
        <NewsCard />
      </div>
    </div>
  );
}

export default MasterAdminDashboard;
