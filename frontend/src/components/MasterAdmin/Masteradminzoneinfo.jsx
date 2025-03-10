import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaRuler, FaUser } from "react-icons/fa";
import Unregistertable from "./Unregistertable";
import ZoneDetails from "../ZoneDetails";
const Masteradminzoneinfo = ({ data, zone }) => {
  const [zoneInfo, setZoneInfo] = useState({});
  const [numOfIndustries, setNumOfIndustries] = useState({});
  const [zoneName, setZoneName] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [unRegister, setUnregister] = useState(false);
  const [regsiter, setRegister] = useState(true);
  useEffect(() => {
    setZoneInfo(zone);
    setNumOfIndustries(data);
  }, [data, zone]);

  const handleUnregisterIndustry = (zone_id, zoneNam) => {
    setZoneId(zone_id);
    setZoneName(zoneNam);
    setUnregister(true);
    setRegister(false);
    setSelectedtagReg(true);
    setSelectedtagUnReg(false);
  };
  const handleRegisterIndustry = (zone_id, zoneNam) => {
    setZoneId(zone_id);
    setZoneName(zoneNam);
    setRegister(true);
    setUnregister(false);
    setSelectedtagReg(false);
    setSelectedtagUnReg(true);
  };

  const [selectedTagReg, setSelectedtagReg] = useState(false);
  const [selectedTagUnReg, setSelectedtagUnReg] = useState(false);

  return (
    <div className="border-2  rounded-lg">
      <div>
        <h2 className="text-center text-3xl font-bold mb-4 text-gray-800 py-8 px-2 ">
          {zoneInfo ? zoneInfo.zone_name : "Waiting for network"} Industrial
          Area Information
        </h2>
        <div className="flex flex-row justify-around">
          <div className="flex flex-col">
            <div className="flex items-center mb-4">
              <FaMapMarkerAlt className="mr-2 text-green-500" />
              <p className="text-lg text-gray-700">
                <strong>Name:</strong>{" "}
                {zoneInfo ? zoneInfo.zone_name : "Network error...."}
              </p>
            </div>
            <div className="flex items-center mb-4">
              <FaRuler className="mr-2 text-blue-500" />
              <p className="text-lg text-gray-700">
                <strong>Area (sq km):</strong>{" "}
                {zoneInfo ? zoneInfo.zone_area : "Network error...."}
              </p>
            </div>
            <div className="flex items-center mb-4">
              <FaUser className="mr-2 text-purple-500" />
              <p className="text-lg text-gray-700">
                <strong>Zone Admin ID:</strong>{" "}
                {zoneInfo ? zoneInfo.zonal_admin_id : "Network error...."}
              </p>
            </div>
          </div>
          <div className="p-1 m-2">
            <div
              className={`text-lg text-gray-700 border border-gray-300 px-4 py-2 rounded-md m-2 cursor-pointer transition-all duration-200 ease-in-out ${
                selectedTagReg ? "" : "bg-gray-300"
              }`}
              onClick={() =>
                handleRegisterIndustry(zone.zone_id, zoneInfo.zone_name)
              }
            >
              <strong>Registered Industries:</strong>{" "}
              {numOfIndustries
                ? numOfIndustries.registeredCount
                : "Network error...."}
            </div>
            <div
              className={`text-lg text-gray-700 border border-gray-300 px-4 py-2 rounded-md inline-block cursor-pointer transition-all duration-200 ease-in-out ${
                selectedTagUnReg ? "" : "bg-gray-300"
              }`}
              onClick={() =>
                handleUnregisterIndustry(zone.zone_id, zoneInfo.zone_name)
              }
            >
              <strong>Unregistered Industries:</strong>{" "}
              {numOfIndustries
                ? numOfIndustries.unRegisteredCount
                : "Network error...."}
            </div>
          </div>
        </div>
      </div>

      {unRegister ? (
        <Unregistertable zoneId={zoneId} zoneName={zoneName} />
      ) : null}
      {zone && regsiter ? (
        <ZoneDetails zoneId={zone.zone_id} zoneName={zone.zone_name} />
      ) : null}
    </div>
  );
};

export default Masteradminzoneinfo;
