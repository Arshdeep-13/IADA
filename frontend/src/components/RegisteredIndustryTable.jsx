import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import xlsx from "json-as-xlsx";
import Cookies from "universal-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ZonalAdminAlerts = () => {
  const [industryData, setIndustryData] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const { zone_id } = useParams();
  const cookies = new Cookies();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const fetchData = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/industry/zoned`,
        { zone_id },
        {
          headers: {
            authorization: `Bearer ${cookies.get("token")}`,
          },
        }
      );
      setIndustryData(response.data);
    } catch (error) {
      console.error("Error fetching industry data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const registeredIndustries = industryData.filter(
    (industry) => industry.is_registered
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentIndustries = registeredIndustries.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleCheckboxChange = (industryId) => {
    setSelectedIndustries((prevSelected) =>
      prevSelected.includes(industryId)
        ? prevSelected.filter((id) => id !== industryId)
        : [...prevSelected, industryId]
    );
  };

  const generateExcelData = async (industries) => [
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
      content: industries.map((industry) => ({
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

  const handleExportAsXls = async () => {
    try {
      const data = await generateExcelData(registeredIndustries);
      const settings = {
        fileName: `${cookies.get("zone")}_Industry_Details`,
      };
      xlsx(data, settings);
      toast.success("All industries exported successfully!");
    } catch (error) {
      toast.error("Failed to export industries.");
    }
  };

  const handleExportSelectedAsXls = async () => {
    if (selectedIndustries.length === 0) {
      toast.error("No industries selected for export");
      return;
    }
    try {
      const selectedData = registeredIndustries.filter((industry) =>
        selectedIndustries.includes(industry._id)
      );
      const data = await generateExcelData(selectedData);
      const settings = {
        fileName: `${cookies.get("zone")}_Selected_Industry_Details`,
      };
      xlsx(data, settings);
      toast.success("Selected industries exported successfully!");
      setSelectedIndustries([]);
    } catch (error) {
      toast.error("Failed to export selected industries.");
    }
  };

  const totalPages = Math.ceil(registeredIndustries.length / itemsPerPage);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-4 py-2 font-semibold hover:bg-blue-300 rounded-md ml-2 ${
            currentPage === i
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-blue-800"
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="relative overflow-x-auto shadow-xl rounded-lg p-6 bg-white dark:bg-gray-800">
      <ToastContainer />
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 sm:gap-2">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Registered Industries
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExportAsXls}
            className="text-sm sm:text-base p-2 bg-red-500 hover:bg-red-400 font-semibold text-white rounded transition duration-200"
          >
            Export All as xls
          </button>
          <button
            onClick={handleExportSelectedAsXls}
            className="text-sm sm:text-base p-2 bg-blue-500 hover:bg-blue-400 font-semibold text-white rounded transition duration-200"
          >
            Export Selected as xls
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-md md:text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4 ">
                Select
              </th>
              <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">
                Plot No
              </th>
              <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">
                Unit / Shed Name
              </th>
              <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">
                Name Of Allottee
              </th>
            </tr>
          </thead>
          <tbody>
            {currentIndustries.map((industry) => (
              <tr
                key={industry._id}
                className="border-b odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-4 py-4 sm:px-6 sm:py-4 whitespace-normal">
                  <input
                    type="checkbox"
                    checked={selectedIndustries.includes(industry._id)}
                    onChange={() => handleCheckboxChange(industry._id)}
                  />
                </td>
                <td className="px-4 py-4 sm:px-6 sm:py-4 whitespace-normal font-medium text-gray-900 dark:text-white">
                  {industry.plot_number}
                </td>
                <td className="px-4 py-4 sm:px-6 sm:py-4 whitespace-normal">
                  <Link
                    to={`/industry/${industry._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {industry.industry_name}
                  </Link>
                </td>
                <td className="px-4 py-4 sm:px-6 sm:py-4 whitespace-normal">
                  {industry.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => {
            if (currentPage - 1 > 0) {
              setCurrentPage(currentPage - 1);
            } else {
              setCurrentPage(totalPages);
            }
          }}
          className="px-4 py-2 font-semibold bg-gray-200 text-blue-800 hover:bg-blue-300 rounded-md"
        >
          Previous
        </button>
        {renderPageNumbers()}
        <button
          onClick={() => {
            if (currentPage + 1 <= totalPages) {
              setCurrentPage(currentPage + 1);
            } else {
              setCurrentPage(1);
            }
          }}
          className="px-4 py-2 font-semibold bg-gray-200 text-blue-800 hover:bg-blue-300 rounded-md ml-2"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ZonalAdminAlerts;
