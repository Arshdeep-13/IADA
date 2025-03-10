import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaIndustry,
  FaSearch,
  FaSort,
  FaTimes,
} from "react-icons/fa";
import { MdError } from "react-icons/md";
import "tailwindcss/tailwind.css";
import xlsx from "json-as-xlsx";
import Cookies from "universal-cookie";
import Adminwaterbilltable from "./Adminwaterbilltable";
import MasterAdminDashControl from "../MasterAdminDashControl";
import NewAlertModal from "../NewAlertModal";

const Masteradminwaterbills = () => {
  const cookies = new Cookies();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [zonedata, setZonedata] = useState("");
  const [bills, setBills] = useState([]);
  const chartRef = useRef();
  const [showChart, setshowChart] = useState(false);
  const chartMainRef = useRef(null); // Reference to store the chart main div
  const chartInstance = useRef(null); // Reference to store the chart instance
  const [showControlPanel, setShowControlPanel] = useState(false);
  const [zoneIds, setZoneIds] = useState([]);
  const sidebarRef = useRef(null);
  const sideBarBtnRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchZoneBills = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER}/api/finances/allzone`
        );
        setBills(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching zone bills:", error);
        setLoading(false);
      }
    };

    fetchZoneBills();
  }, []);
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER}/api/zone`);
        setZoneIds(res.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching zone details");
        setLoading(false);
      }
    };
    fetchDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
      </div>
    );
  }
  const handleExportAsXls = async () => {
    let data = [
      {
        sheet: "Bills",
        columns: [
          {
            label: "Date",
            value: (row) =>
              row.date ? new Date(row.date).toLocaleDateString() : "",
          },
          { label: "Name", value: "consumerName" },
          { label: "Premises", value: "premises" },
          { label: "Zones", value: "zones" },
          { label: "Meter Reading Start", value: "startRangeMeterReading" },
          { label: "Meter Reading End", value: "endRangeMeterReading" },
          { label: "Rate per Liter", value: "rsPerKl" },
          { label: "Meter No", value: "meterNo" },
          {
            label: "Due Date",
            value: (row) =>
              row.dueDate ? new Date(row.dueDate).toLocaleDateString() : "",
          },
          { label: "Amount", value: "amountPayOnDueDate" },
          { label: "Amount After Due Date", value: "amountPayAfterDueDate" },
        ],
        content: bills.map((bill) => ({
          date: bill.date,
          consumerName: bill.consumerName ? bill.consumerName : "N/A",
          premises: bill.premises ? bill.premises : "N/A",
          zones: bill.zone ? bill.zone : "N/A",
          startRangeMeterReading: bill.startRangeMeterReading
            ? bill.startRangeMeterReading
            : "N/A",
          endRangeMeterReading: bill.endRangeMeterReading
            ? bill.endRangeMeterReading
            : "N/A",
          rsPerKl: bill.rsPerKl ? bill.rsPerKl : "N/A",
          meterNo: bill.meterNo ? bill.meterNo : "N/A",
          dueDate: bill.dueDate ? bill.dueDate : "N/A",
          amountPayOnDueDate: bill.amountPayOnDueDate
            ? bill.amountPayOnDueDate
            : "N/A",
          amountPayAfterDueDate:
            parseFloat(bill.amountPayOnDueDate) + parseFloat(bill.currentTotal)
              ? parseFloat(bill.amountPayOnDueDate) +
                parseFloat(bill.currentTotal)
              : "N/A",
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
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaIndustry className="animate-spin mr-2 text-4xl" />
        Loading zones...
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        <MdError className="mr-2 text-4xl" />
        {error}
      </div>
    );
  }
  const filteredZones = zoneIds.filter((zone) =>
    zone.zone_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleClose = () => {
    setZonedata("");
  };
  const handleZoneClick = async (zoneId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/finances/billbyZone`,
        {
          params: {
            zoneId: zoneId,
          },
        }
      );
      setZonedata(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching zone bills:", error);
      setLoading(false);
    }
  };
  const handleBillsAnalytics = () => {
    setshowChart(!showChart);

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
    bills.map((bill) => {
      const month = new Date(bill.date).getMonth();
      switch (month) {
        case 0:
          janAmt += parseFloat(bill.amountPayOnDueDate);
          break;
        case 1:
          febAmt += parseFloat(bill.amountPayOnDueDate);
          break;
        case 2:
          marAmt += parseFloat(bill.amountPayOnDueDate);
          break;
        case 3:
          aprAmt += parseFloat(bill.amountPayOnDueDate);
          break;
        case 4:
          mayAmt += parseFloat(bill.amountPayOnDueDate);
          break;
        case 5:
          junAmt += parseFloat(bill.amountPayOnDueDate);
          break;
        case 6:
          julAmt += parseFloat(bill.amountPayOnDueDate);
          break;
        case 7:
          augAmt += parseFloat(bill.amountPayOnDueDate);
          break;
        case 8:
          sepAmt += parseFloat(bill.amountPayOnDueDate);
          break;
        case 9:
          octAmt += parseFloat(bill.amountPayOnDueDate);
          break;
        case 10:
          novAmt += parseFloat(bill.amountPayOnDueDate);
          break;
        case 11:
          decAmt += parseFloat(bill.amountPayOnDueDate);
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

    if (!showChart) {
      chartRef.current.style = "display: block";
      chartMainRef.current &&
        chartMainRef.current.classList.add("h-auto", "w-auto");
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      chartInstance.current = new Chart(chartRef.current, {
        type: "line",
        data: {
          labels: data.map((row) => row.month),
          datasets: [
            {
              label: `All Zone Water Bill Payment History`,
              data: data.map((row) => {
                return row.amt;
              }),
            },
          ],
        },
      });
    } else {
      chartInstance.current.destroy();
      chartRef.current.style = "display: none";
      chartMainRef.current &&
        chartMainRef.current.classList.remove("h-auto", "w-auto");
    }
  };
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
      <div className="container mx-auto p-4">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2"> All Zones Water Bills </h1>
          <p className="text-gray-600">
            Manage and view details of all zones water bills
          </p>
          <div className="relative mt-4 w-full sm:w-1/2 lg:w-1/3 mx-auto">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search zones..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </header>

        <div className="overflow-x-auto mt-10 rounded-lg">
          <div className="flex justify-between items-center mb-4 gap-5 px-4">
            <div className="flex gap-5">
              <button
                onClick={handleBillsAnalytics}
                className="text-sm md:text-base p-2 bg-blue-500 hover:bg-blue-400 font-semibold text-white rounded transition duration-200"
              >
                View Analytics
              </button>
              <button
                onClick={handleExportAsXls}
                className="text-sm md:text-base p-2 bg-red-500 hover:bg-red-400 font-semibold text-white rounded transition duration-200"
              >
                Export as xls
              </button>
            </div>
          </div>
          <div ref={chartMainRef} className="flex justify-center items-center">
            <canvas
              ref={chartRef}
              className="hidden mt-5 mb-5"
              id="chartDiv"
            ></canvas>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th
                  className="border-r border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("zone_id")}
                >
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-1" />
                    Zone-ID
                    {sortConfig.key === "zone_id" &&
                      (sortConfig.direction === "ascending" ? (
                        <FaSort className="ml-1" />
                      ) : (
                        <FaSort className="ml-1 rotate-180" />
                      ))}
                  </div>
                </th>
                <th
                  className="border-r border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("zone_name")}
                >
                  Zone Name
                  {sortConfig.key === "zone_name" &&
                    (sortConfig.direction === "ascending" ? (
                      <FaSort className="ml-1" />
                    ) : (
                      <FaSort className="ml-1 rotate-180" />
                    ))}
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredZones.map((zoneId, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border-r border-gray-200 px-4 py-2">
                    {zoneId.zone_id}
                  </td>
                  <td className="border-r border-gray-200 px-4 py-2">
                    {zoneId.zone_name}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                      onClick={() => handleZoneClick(zoneId.zone_id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {zonedata && (
          <div className="flex justify-end mt-4">
            <button
              className="text-red-500 hover:text-red-600 focus:outline-none"
              onClick={handleClose}
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        )}
        {zonedata && <Adminwaterbilltable bills={zonedata} />}
      </div>
    </>
  );
};

export default Masteradminwaterbills;
