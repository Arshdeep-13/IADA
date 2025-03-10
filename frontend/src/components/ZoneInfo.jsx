import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaMapMarkerAlt, FaRuler, FaUser } from "react-icons/fa";
import Cookies from "universal-cookie";
import { Puff } from "react-loader-spinner";

const ZoneInfo = () => {
  const [zoneInfo, setZoneInfo] = useState({});
  const [numOfIndustries, setNumOfIndustries] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { zone_id } = useParams();
  const cookies = new Cookies();

  const fetchZoneInfo = async () => {
    try {
      const zoneResponse = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/zone`,
        {
          zone_id: zone_id,
        },
        {
          headers: {
            authorization: `Bearer ${cookies.get("token")}`,
          },
        }
      );
      setZoneInfo(zoneResponse.data[0]);
      const industryResponse = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/industry`,
        { zone_id: zone_id },
        {
          headers: {
            authorization: `Bearer ${cookies.get("token")}`,
          },
        }
      );
      setNumOfIndustries(industryResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching zone info:", error);
      setError("Error fetching zone information. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZoneInfo();
  }, [zone_id]);

  return (
    <div className="">
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <Puff color="#4A90E2" height={100} width={100} />
          <p className="mt-4 text-gray-600 font-semibold">Loading...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 font-semibold">{error}</div>
      ) : (
        <div>
          <h2 className="text-center text-3xl font-bold mb-4 text-gray-800">
            Industrial Area Information
          </h2>
          <div className="flex flex-row justify-around">
            <div className="flex flex-col">
              <div className="flex items-center mb-4">
                <FaMapMarkerAlt className="mr-2 text-green-500" />
                <p className="text-slg text-gray-700">
                  <strong>Name:</strong> {zoneInfo.zone_name}
                </p>
              </div>
              <div className="flex items-center mb-4">
                <FaRuler className="mr-2 text-blue-500" />
                <p className="text-lg text-gray-700">
                  <strong> Area(sq km):</strong> {zoneInfo.zone_area}
                </p>
              </div>
              
              <div className="flex items-center mb-4">
                <FaUser className="mr-2 text-yellow-500" />
                <p className="text-lg text-gray-700">
                  <strong>Zone Admin Name:</strong> {cookies.get("username")}
                </p>
              </div>
            </div>
            <div>
              <div className="flex-col ">
                <div className="text-xl text-gray-700 mb-10">
                  <strong>Registered Industries:</strong>{" "}
                  {numOfIndustries.registeredCount}
                </div>
                <div className="text-xl text-gray-700">
                  <strong>Un-Registered Industries:</strong>{" "}
                  {numOfIndustries.unRegisteredCount}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZoneInfo;
