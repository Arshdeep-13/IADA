import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "tailwindcss/tailwind.css";
import xlsx from "json-as-xlsx";
import Cookies from "universal-cookie";
import Chart from "chart.js/auto";
import ZoneWaterBillTable from "./ZoneWaterBillTable";
import { FaCalendarAlt, FaSearch } from "react-icons/fa";
import AdminDashControl from "../components/ZonalAdminDashControl";

const ZonePaymentHistory = () => {
  const { zone_id } = useParams();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const cookies = new Cookies();
  const chartRef = React.useRef();
  const chartMainRef = React.useRef(null); // Reference to store the chart main div
  const chartInstance = React.useRef(null); // Reference to store the chart instance
  const sidebarRef = useRef(null);
  const sideBarBtnRef = useRef(null);
  const [showControlPanel, setShowControlPanel] = useState(false);

  useEffect(() => {
    const fetchZoneBills = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER
          }/api/finances/fetchbillsbyzone/${zone_id}`
        );
        setBills(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching zone bills:", error);
        setLoading(false);
      }
    };

    fetchZoneBills();
  }, [zone_id]);
  useEffect(() => {
    if (!loading && bills.length > 0) {
      generateChart();
    }
  }, [loading, bills]);
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

  const generateChart = () => {
    let janAmt = 0,
      febAmt = 0,
      marAmt = 0,
      aprAmt = 0,
      mayAmt = 0,
      junAmt = 0,
      julAmt = 0,
      augAmt = 0,
      sepAmt = 0,
      octAmt = 0,
      novAmt = 0,
      decAmt = 0;
    bills.forEach((bill) => {
      const month = new Date(bill.date).getMonth();
      switch (month) {
        case 0:
          janAmt += bill.amountPayOnDueDate;
          break;
        case 1:
          febAmt += bill.amountPayOnDueDate;
          break;
        case 2:
          marAmt += bill.amountPayOnDueDate;
          break;
        case 3:
          aprAmt += bill.amountPayOnDueDate;
          break;
        case 4:
          mayAmt += bill.amountPayOnDueDate;
          break;
        case 5:
          junAmt += bill.amountPayOnDueDate;
          break;
        case 6:
          julAmt += bill.amountPayOnDueDate;
          break;
        case 7:
          augAmt += bill.amountPayOnDueDate;
          break;
        case 8:
          sepAmt += bill.amountPayOnDueDate;
          break;
        case 9:
          octAmt += bill.amountPayOnDueDate;
          break;
        case 10:
          novAmt += bill.amountPayOnDueDate;
          break;
        case 11:
          decAmt += bill.amountPayOnDueDate;
          break;
        default:
          break;
      }
    });

    const data = [
      { month: "January", amt: janAmt },
      { month: "February", amt: febAmt },
      { month: "March", amt: marAmt },
      { month: "April", amt: aprAmt },
      { month: "May", amt: mayAmt },
      { month: "June", amt: junAmt },
      { month: "July", amt: julAmt },
      { month: "August", amt: augAmt },
      { month: "September", amt: sepAmt },
      { month: "October", amt: octAmt },
      { month: "November", amt: novAmt },
      { month: "December", amt: decAmt },
    ];

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels: data.map((row) => row.month),
        datasets: [
          {
            label: `${cookies.get("zone")} Zone Water Bill Payment History`,
            data: data.map((row) => row.amt),
          },
        ],
      },
    });
  };
  const handleExportAsXls = async () => {
    let data = [
      {
        sheet: "Bills",
        columns: [
          {
            label: "Date",
            value: (row) => new Date(row.date).toLocaleDateString(),
          },
          { label: "Name", value: "consumerName" },
          { label: "Premises", value: "premises" },
          { label: "Meter Reading Start", value: "startRangeMeterReading" },
          { label: "Meter Reading End", value: "endRangeMeterReading" },
          { label: "Rate per Liter", value: "rsPerKl" },
          { label: "Meter No", value: "meterNo" },
          { label: "Due Date", value: "duedate" },
          { label: "Amount", value: "amount1" },
          { label: "Amount After Due Date", value: "amountPayAfterDueDate" },
          {
            label: "Industry Name",
            value: (row) =>
              row.industryInfo ? row.industryInfo.industry_name : "N/A",
          },
          {
            label: "GST IN",
            value: (row) =>
              row.industryInfo ? row.industryInfo.gstin_number : "N/A",
          },
        ],
        content: bills.map((bill) => ({
          date: bill.date,
          consumerName: bill.consumerName,
          premises: bill.premises,
          startRangeMeterReading: bill.startRangeMeterReading,
          endRangeMeterReading: bill.endRangeMeterReading,
          rsPerKl: bill.rsPerKl,
          meterNo: bill.meterNo,
          duedate: bill.duedate,
          amount1: bill.amountPayOnDueDate,
          amountPayAfterDueDate: bill.amountPayAfterDueDate,
          industryInfo: bill.industryInfo,
        })),
      },
    ];

    let settings = {
      fileName: `${cookies.get("zone")}_Zone_Payment_History`,
    };

    xlsx(data, settings);
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const filteredBills = bills.filter(
    (bill) =>
      Object.values(bill).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      (bill.industryInfo &&
        (bill.industryInfo.industry_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
          bill.industryInfo.gstin_number
            .toLowerCase()
            .includes(searchTerm.toLowerCase())))
  );
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
          <div ref={chartMainRef} className="flex justify-center items-center">
            <canvas ref={chartRef} className="mt-5 mb-5" id="chartDiv"></canvas>
          </div>
          <div className="relative mx-auto w-full md:w-1/2 lg:w-1/3">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search bills..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <ZoneWaterBillTable bills={filteredBills} />
        </div>
      </div>
    </>
  );
};

export default ZonePaymentHistory;
