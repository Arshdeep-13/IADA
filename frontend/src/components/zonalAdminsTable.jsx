import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEnvelope, FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";

const ZonalAdminsTable = () => {
  const NameOfZone = ({ zoneId }) => {
    const [zoneName, setZoneName] = useState(null);

    useEffect(() => {
      const fetchZoneName = async () => {
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_SERVER}/api/zone`,
            {
              zone_id: zoneId,
            }
          );
          setZoneName(res.data[0].zone_name);
        } catch (error) {
          console.error("Error fetching zone name:", error);
          setZoneName("Unknown Zone");
        }
      };
      fetchZoneName();
    }, [zoneId]);

    return (
      <span>
        {zoneName === null ? (
          <FaSpinner className="animate-spin mr-2 text-blue-500" />
        ) : (
          zoneName
        )}
      </span>
    );
  };

  const [zadminData, setZadminData] = useState([]);
  const [unapprovedAdmins, setUnapprovedAdmins] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/zAdmin/getalladmin`
      );
      setZadminData(response.data.filter((admin) => admin.is_approved));
      setUnapprovedAdmins(response.data.filter((admin) => !admin.is_approved));
    } catch (error) {
      console.error("Error fetching zadmin data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    const confirmApprove = window.confirm(
      "Are you sure you want to approve this admin?"
    );
    if (!confirmApprove) return;

    try {
      await axios.post(`${import.meta.env.VITE_SERVER}/api/zAdmin/approve`, {
        id,
      });
      fetchData(); // Refresh the data
    } catch (error) {
      console.error("Error approving admin:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this admin?"
    );
    if (!confirmDelete) return;

    try {
      await axios.post(`${import.meta.env.VITE_SERVER}/api/zAdmin/delete/`, {
        id,
      });
      fetchData(); // Refresh the data
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-6 bg-white dark:bg-gray-800">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Zonal Admin Data
      </h2>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Admin Name
            </th>
            <th scope="col" className="px-6 py-3">
              Zone Name
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            {/* Add more table headers as needed */}
          </tr>
        </thead>
        <tbody>
          {zadminData.map((zadmin) => (
            <tr
              key={zadmin._id}
              className="border-b odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 dark:border-gray-700"
            >
              <td className="px-6 py-4 font-medium text-blue-500  whitespace-nowrap dark:text-white">
                <Link to={`/zadmin/${zadmin._id}`}>{zadmin.admin_name}</Link>
              </td>
              <td className="px-6 py-4">
                <NameOfZone zoneId={zadmin.zone_id} />
              </td>
              <td className="px-6 py-4">
                <a
                  href={`mailto:${zadmin.admin_email}`}
                  className="flex items-center text-purple-800"
                >
                  <FaEnvelope className="mr-1" />
                  {zadmin.admin_email}
                </a>
              </td>
              {/* Render additional data here */}
            </tr>
          ))}
        </tbody>
      </table>

      {unapprovedAdmins.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Unapproved Zonal Admins
          </h2>
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Admin Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Zone Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {unapprovedAdmins.map((zadmin) => (
                <tr
                  key={zadmin._id}
                  className="border-b odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 dark:border-gray-700"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {zadmin.admin_name}
                  </td>
                  <td className="px-6 py-4">
                    <NameOfZone zoneId={zadmin.zone_id} />
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`mailto:${zadmin.admin_email}`}
                      className="flex items-center text-purple-800"
                    >
                      <FaEnvelope className="mr-1" />
                      {zadmin.admin_email}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleApprove(zadmin._id)}
                      className="px-4 py-2 mr-2 bg-green-600 text-white rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDelete(zadmin._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ZonalAdminsTable;
