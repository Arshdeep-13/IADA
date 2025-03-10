import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "tailwindcss/tailwind.css";
import xlsx from "json-as-xlsx";
import Cookies from "universal-cookie";
import { FaCalendarAlt, FaSearch } from "react-icons/fa";
import { AiOutlineDownload } from "react-icons/ai";
import { generatePdf } from "../../utils/generatePdf";
import AdminDashControl from "../components/ZonalAdminDashControl";
import AdminPaymentsTable from "../components/MasterAdmin/AdminPaymentsTable";

const ZonalPaymentHistory = () => {
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
          `${import.meta.env.VITE_SERVER
          }/api/finances/getfullzonepayment/${zone_id}`,
          {
            headers: {
              authorization: `Bearer ${cookies.get("token")}`,
            },
          }
        );
        setBills(response.data?.industryPayments || []);
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

  const handleExportAsXls = async () => {
    let data = [
      {
        sheet: "Payments",
        columns: [
          { label: "Date", value: "TransactionDate" },
          { label: "Reference Number", value: "ReferenceNo" },
          { label: "Amount", value: "TransactionAmount" },
          { label: "Response Code", value: "ResponseCode" }
        ],
        content: bills.map((bill) => ({
          TransactionDate: bill.TransactionDate,
          ReferenceNo: bill.ReferenceNo,
          TransactionAmount: bill.TransactionAmount,
          ResponseCode: bill.ResponseCode,
        })),
      },
    ];

    let settings = {
      fileName: `${cookies.get("zone")}_Zone_Payment_History`,
    };

    xlsx(data, settings);
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
          className={`border-b-2 absolute top-0 left-0 h-full pt-24 md:pt-28 overflow-x-hidden bg-white z-30 transition-transform duration-500 ease-in-out ${showControlPanel
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
          <h1 className="mt-6 text-3xl font-bold text-blue-600 flex items-center">
            Zone Water Bills <FaCalendarAlt className="text-blue-600 ml-2" />
          </h1>
        </div>
        <div className="overflow-x-auto mt-10 rounded-lg">
          <div className="flex justify-between items-center mb-4 gap-5 px-4">
            <button
              onClick={handleExportAsXls}
              className="text-sm md:text-base p-2 bg-red-500 hover:bg-red-400 font-semibold text-white rounded transition duration-200"
            >
              Export as xls
            </button>
          </div>
          <div className="overflow-x-auto shadow-lg rounded-lg">
            <AdminPaymentsTable payments={bills}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default ZonalPaymentHistory;
