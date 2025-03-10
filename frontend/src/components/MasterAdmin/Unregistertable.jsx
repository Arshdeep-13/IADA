import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEnvelope, FaSpinner } from "react-icons/fa";
import xlsx from "json-as-xlsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheckCircle } from "react-icons/fa";
import { BsChatLeftTextFill } from "react-icons/bs";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const Unregistertable = ({ zoneId, zoneName }) => {
  const [industryData, setIndustryData] = useState([]);
  const [filteredIndustries, setFilteredIndustries] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [industriesPerPage] = useState(15);
  const [chatData, setChatData] = useState([]);
  const indexOfLastIndustry = currentPage * industriesPerPage;
  const indexOfFirstIndustry = indexOfLastIndustry - industriesPerPage;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER}/api/industry/zoned`,
          { zone_id: zoneId },
          {
            headers: {
              authorization: `Bearer ${cookies.get("token")}`,
            },
          }
        );
        const chatData = await axios.get(
          `${import.meta.env.VITE_SERVER}/api/industry/all-chat`
        );
        setIndustryData(response.data);
        setChatData(chatData.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching industry data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [zoneId]);

  const handleCheckboxChange = (industryId) => {
    setSelectedIndustries((prevSelected) =>
      prevSelected.includes(industryId)
        ? prevSelected.filter((id) => id !== industryId)
        : [...prevSelected, industryId]
    );
  };
  const handleExportSelectedAsXls = () => {
    if (selectedIndustries.length === 0) {
      toast.error("No industries selected for export");
      return;
    }

    try {
      const selectedData = industryData.filter((industry) =>
        selectedIndustries.includes(industry._id)
      );

      let data = [
        {
          sheet: "Industry_Details",
          columns: [
            { label: "Name", value: "name" },
            { label: "Email", value: "email" },
            { label: "Phone Number", value: "phone_number" },
            { label: "Industry Name", value: "industry_name" },
            { label: "Industry Area", value: "industry_area" },
            { label: "Plot Number", value: "plot_number" },
            { label: "Number of Employees", value: "no_of_employees" },
            { label: "Himachali Employees", value: "himachali_employees" },
            { label: "Lessee", value: "lessee" },
            { label: "Item Manufactured", value: "item_manufactured" },
            { label: "GST IN", value: "gstin_number" },
          ],
          content: selectedData.map((industry) => ({
            name: industry.name,
            email: industry.email,
            phone_number: industry.phone_number,
            industry_name: industry.industry_name,
            industry_area: industry.industry_area,
            plot_number: industry.plot_number,
            no_of_employees: industry.no_of_employees,
            himachali_employees: industry.no_of_employees_HIM,
            lessee: industry.lessee,
            item_manufactured: industry.item_manufactured,
            gstin_number: industry.gstin_number,
          })),
        },
      ];

      let settings = {
        fileName: `${zoneName}_Selected_Industry_Details`,
      };

      xlsx(data, settings);
      toast.success("Selected industries exported successfully!");
      setSelectedIndustries([]); // Clear selected industries
    } catch (error) {
      toast.error("Failed to export selected industries.");
      console.log(error);
    }
  };
  const registeredIndustries = filteredIndustries.filter(
    (industry) => !industry.is_registered
  );
  const currentIndustries = registeredIndustries.slice(
    indexOfFirstIndustry,
    indexOfLastIndustry
  );
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    if (searchQuery) {
      const filtered = industryData.filter((industry) =>
        [industry.plot_number, industry.industry_name, industry.name].some(
          (field) => field.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredIndustries(filtered);
    } else {
      setFilteredIndustries(industryData);
    }
  }, [searchQuery, industryData]);
  return (
    <div className="p-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg shadow-md overflow-x-auto">
      <ToastContainer />
      <div className="flex justify-around items-center mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border rounded-md dark:border-gray-600"
          />
          <button
            onClick={handleExportSelectedAsXls}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Export Selected as xls
          </button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center">
          <FaSpinner className="animate-spin mr-2 text-blue-500" />
          <span className="text-blue-500">Loading...</span>
        </div>
      ) : (
        <div>
          <table className="w-full text-sm border-collapse border border-gray-200 mb-4">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3">Select</th>
                <th className="px-6 py-3">Plot Number</th>
                <th className="px-6 py-3">Unit/Shed Name</th>
                <th className="px-6 py-3">Name of Allottee</th>
                <th className="px-6 py-3">Grievances</th>
              </tr>
            </thead>
            <tbody>
              {currentIndustries.map((industry) => {
                const industryChat = chatData.find(
                  (val) => val.userId === industry._id
                );

                const isOnline = industryChat
                  ? industryChat.isSatisfied
                  : false;
                return (
                  <tr
                    key={industry._id}
                    className="bg-white dark:bg-gray-900 border-b dark:border-gray-700"
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIndustries.includes(industry._id)}
                        onChange={() => handleCheckboxChange(industry._id)}
                      />
                    </td>
                    <td className="px-4 py-4">{industry.plot_number}</td>
                    <td className="px-4 py-4">
                      <Link
                        to={`/industry/${industry._id}`}
                        className="text-blue-700 underline"
                      >
                        {industry.industry_name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">{industry.name}</td>

                    <td className="px-6 py-4 flex items-center justify-center">
                      {industryChat ? (
                        isOnline ? (
                          <span className="text-green-600 item-center justify-center text-xl">
                            <FaCheckCircle />
                          </span>
                        ) : (
                          <span className="text-red-600 item-center justify-center text-xl">
                            <BsChatLeftTextFill />
                          </span>
                        )
                      ) : (
                        <span className="px-6 py-4">No record Found</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <ul className="flex justify-center space-x-2">
            {[
              ...Array(
                Math.ceil(filteredIndustries.length / industriesPerPage)
              ).keys(),
            ].map((number) => (
              <li key={number} className="cursor-pointer">
                <button
                  onClick={() => paginate(number + 1)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                >
                  {number + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Unregistertable;
