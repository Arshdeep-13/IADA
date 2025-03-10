import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const ZAdminDetails = () => {
  const { _id } = useParams();
  const cookies = new Cookies();
  const [zAdmin, setZAdmin] = useState(null);
  const [zoneData, setZoneData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminDetails = async () => {
      setLoading(true);
      try {
        // Fetch the Zonal Admin details
        const adminResponse = await axios.post(
          `${import.meta.env.VITE_SERVER}/api/zadmin/getone`,
          { _id },
          {
            headers: {
              authorization: `Bearer ${cookies.get("token")}`,
            },
          }
        );
        setZAdmin(adminResponse.data);

        // Fetch additional data using zone_id from the fetched admin data
        if (adminResponse.data.zone_id) {
          const zoneResponse = await axios.post(
            `${import.meta.env.VITE_SERVER}/api/zone`,
            { zone_id: adminResponse.data.zone_id }
          );
          setZoneData(zoneResponse.data[0]); // Assuming the response data is an array and we need the first element
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDetails();
  }, [_id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-9 bg-white shadow-lg rounded-lg mt-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center mb-4 text-blue-500 hover:text-blue-700 transition duration-300"
      >
        <FaArrowLeft className="mr-2" /> Go Back
      </button>
      {zAdmin && zoneData && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
            Zonal Admin Details
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between text-lg">
              <span className="font-semibold text-blue-800">Admin Name:</span>
              <span>{zAdmin.admin_name}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-semibold text-blue-800">Email:</span>
              <span>{zAdmin.admin_email}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-semibold text-blue-800">Phone number:</span>
              <span>{zAdmin.phone_number}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-semibold text-blue-800">Zone Name:</span>
              <span>{zoneData.zone_name}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-semibold text-blue-800">Zone Area:</span>
              <span>{zoneData.zone_area}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZAdminDetails;
