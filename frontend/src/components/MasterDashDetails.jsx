import axios from "axios";
import React, { useEffect, useState } from "react";
import ZoneDetails from "./ZoneDetails";
import { FaIndustry, FaSearch, FaSort, FaSpinner } from "react-icons/fa";
import { MdError } from "react-icons/md";
import Cookies from "universal-cookie";
import ZonalAdminsTable from "./zonalAdminsTable";
import xlsx from "json-as-xlsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Masteradminzoneinfo from "./MasterAdmin/Masteradminzoneinfo";

const MasterDashDetails = () => {
  const cookies = new Cookies();
  const [zones, setZones] = useState([]);
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const [selectedZoneName, setSelectedZoneName] = useState(null);
  const [zoneDetailsKey, setZoneDetailsKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [zonesPerPage] = useState(15);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [zoneInfo, setZoneInfo] = useState({});
  const [numOfIndustries, setNumOfIndustries] = useState({});
  const [highlightedRow, setHighlightedRow] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER}/api/zone`);
        setZones(res.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching zone details");
        setLoading(false);
      }
    };
    fetchDetails();
  }, []);

  useEffect(() => {
    const fetchZoneInfo = async () => {
      try {
        const zoneResponse = await axios.post(
          `${import.meta.env.VITE_SERVER}/api/zone`,
          {
            zone_id: selectedZoneId,
          }
        );
        setZoneInfo(zoneResponse.data[0]);
        const industryResponse = await axios.post(
          `${import.meta.env.VITE_SERVER}/api/industry`,
          { zone_id: selectedZoneId }
        );
        setNumOfIndustries(industryResponse.data);
      } catch (error) {
        console.error("Error fetching zone info:", error);
        setError("Error fetching zone information. Please try again later.");
      }
    };

    fetchZoneInfo();
  }, [selectedZoneId]);

  const handleZoneClick = (zoneId, zoneName) => {
    setSelectedZoneId(zoneId);
    setSelectedZoneName(zoneName);
    setZoneDetailsKey((prevKey) => prevKey + 1); // Increment key to force re-render
  };

  const getNumberOfIndustries = async (zoneId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/industry`,
        {
          zone_id: zoneId,
        }
      );
      return res.data.registeredCount;
    } catch (error) {
      console.error("Error fetching number of industries:", error);
      return null;
    }
  };
  cookies.set("selected_zone", selectedZoneId);
  const IndustriesCount = ({ zoneId }) => {
    const [numberOfIndustries, setNumberOfIndustries] = useState(null);

    useEffect(() => {
      const fetchIndustriesCount = async () => {
        const count = await getNumberOfIndustries(zoneId);
        setNumberOfIndustries(count);
      };
      fetchIndustriesCount();
    }, [zoneId]);

    return (
      <span>
        {numberOfIndustries === null ? (
          <FaSpinner className="animate-spin mr-2 text-blue-500" />
        ) : (
          numberOfIndustries
        )}
      </span>
    );
  };

  const filteredZones = zones.filter((zone) =>
    zone?.zone_name?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const sortedZones = filteredZones.sort((a, b) => {
    if (sortConfig.key) {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      if (
        sortConfig.key === "zone_area" ||
        sortConfig.key === "number_of_industries"
      ) {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }
      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
    }
    return 0;
  });

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const indexOfLastZone = currentPage * zonesPerPage;
  const indexOfFirstZone = indexOfLastZone - zonesPerPage;
  const currentZones = sortedZones.slice(indexOfFirstZone, indexOfLastZone);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset pagination to first page on search
  };

  const handleRowHighlight = (zoneId) => {
    setHighlightedRow(zoneId);
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

  const handleExportAsXls = async (zone_id, zone_name) => {
    let registeredIndustries = [];
    try {
      let response = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/industry/zoned`,
        { zone_id: zone_id },
        {
          headers: {
            authorization: `Bearer ${cookies.get("token")}`,
          },
        }
      );
      response = await response.data;
      registeredIndustries = response.filter(
        (industry) => industry.is_registered
      );

      if (registeredIndustries.length == 0) {
        toast.error("No registered industries found for this zone.", {
          position: "top-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        return;
      }
    } catch (err) {
      toast.error(error.message, {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
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
          {
            label: "Established Date",
            value: (row) => new Date(row.established_date).toLocaleDateString(),
          },
          { label: "Lessee", value: "lessee" },
          { label: "Item Manufactured", value: "item_manufactured" },
          { label: "GST IN", value: "gstin_number" },
        ],
        content: registeredIndustries.map((industry) => ({
          name: industry.name,
          email: industry.email,
          phone_number: industry.phone_number,
          industry_name: industry.industry_name,
          industry_area: industry.industry_area,
          plot_number: industry.plot_number,
          established_date: industry.established_date,
          lessee: industry.lessee,
          item_manufactured: industry.item_manufactured,
          gstin_number: industry.gstin_number,
        })),
      },
    ];

    let settings = {
      fileName: `${zone_name}_Industry_Details`,
    };

    xlsx(data, settings);
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Master Dashboard</h1>
        <p className="text-gray-600">View the details of all zones</p>
        <div className="relative mt-4 w-1/3 sm:w-1/2 lg:w-1/3 mx-auto">
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
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th
                className="border-r border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("zone_name")}
              >
                Industrial Zone Name
                {sortConfig.key === "zone_name" &&
                  (sortConfig.direction === "ascending" ? (
                    <FaSort className="ml-1" />
                  ) : (
                    <FaSort className="ml-1 rotate-180" />
                  ))}
              </th>
              <th
                className="border-r border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("zone_area")}
              >
                Zone Area (sq KM)
                {sortConfig.key === "zone_area" &&
                  (sortConfig.direction === "ascending" ? (
                    <FaSort className="ml-1" />
                  ) : (
                    <FaSort className="ml-1 rotate-180" />
                  ))}
              </th>
              <th className="border-r border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                Industries
                {sortConfig.key === "number_of_industries" &&
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
            {currentZones.map((zone) => (
              <tr
                key={zone._id}
                className={`hover:bg-gray-50 transition-colors duration-200 ${
                  zone.zone_id === highlightedRow ? "bg-blue-100" : ""
                }`}
                onClick={() => handleRowHighlight(zone.zone_id)}
              >
                <td className="border-r border-gray-200 px-4 py-2">
                  {zone.zone_name}
                </td>
                <td className="border-r border-gray-200 px-4 py-2">
                  {zone.zone_area}
                </td>
                <td className="border-r border-gray-200 px-4 py-2">
                  <IndustriesCount zoneId={zone.zone_id} />
                </td>
                <td className=" py-2">
                  <button
                    className="mr-4 bg-blue-500 text-white py-1 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                    onClick={() =>
                      handleZoneClick(zone.zone_id, zone.zone_name)
                    }
                  >
                    View Details
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition-colors duration-300"
                    onClick={() =>
                      handleExportAsXls(zone.zone_id, zone.zone_name)
                    }
                  >
                    Export as xlsx
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-center">
        <nav>
          <ul className="inline-flex -space-x-px">
            {Array.from(
              { length: Math.ceil(filteredZones.length / zonesPerPage) },
              (_, index) => (
                <li key={index}>
                  <button
                    onClick={() => paginate(index + 1)}
                    className={`py-2 px-3 leading-tight border ${
                      currentPage === index + 1
                        ? "text-blue-600 border-blue-300 bg-blue-50"
                        : "text-gray-500 border-gray-300 bg-white hover:bg-gray-100 hover:text-gray-700"
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              )
            )}
          </ul>
        </nav>
      </div>

      {selectedZoneId && (
        <div className="mt-8">
          <Masteradminzoneinfo
            key={zoneDetailsKey}
            data={numOfIndustries}
            zone={zoneInfo}
          />
        </div>
      )}

      {localStorage.getItem("showAdmins") === "true" && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <ZonalAdminsTable />
        </div>
      )}
    </div>
  );
};

export default MasterDashDetails;
