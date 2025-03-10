import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { FaEnvelope, FaSpinner } from "react-icons/fa";
import Cookies from "universal-cookie";

const ZonalAdminAlerts = () => {
  const [industryData, setIndustryData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { zone_id } = useParams();
  const cookies = new Cookies();

  const fetchData = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/industry/zoned`,
        { zone_id: zone_id },
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

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredIndustries = industryData.filter((industry) => {
    return (
      industry.is_registered &&
      (industry.plot_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        industry.industry_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        industry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        industry.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-6 bg-white dark:bg-gray-800">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Registered Industries
      </h2>
      <input
        type="text"
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearch}
      />
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Plot No
            </th>
            <th scope="col" className="px-6 py-3">
              Industry Name
            </th>
            <th scope="col" className="px-6 py-3">
              Industry Head
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            {/* Add more table headers as needed */}
          </tr>
        </thead>
        <tbody>
          {filteredIndustries.map((industry) => (
            <tr
              key={industry._id}
              className="border-b odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 dark:border-gray-700"
            >
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {industry.plot_number}
              </td>
              <td className="px-6 py-4">
                <Link
                  to={`/industry/${industry._id}`} // Assuming "/industry/:id" is the route for viewing industry details
                  className="text-blue-500 hover:underline"
                >
                  {industry.industry_name}
                </Link>
              </td>
              <td className="px-6 py-4">{industry.name}</td>
              <td className="px-6 py-4">
                <a
                  href={`mailto:${industry.email}`}
                  className="flex items-center text-purple-800"
                >
                  <FaEnvelope className="mr-1" />
                  {industry.email}
                </a>
              </td>
              {/* Render additional data here */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ZonalAdminAlerts;
