import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { FaEnvelope } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
const Maindustrydetails = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [zone, setZone] = useState(null);
  const [data, setData] = useState({});
  useEffect(() => {
    const fetchIndustryDetails = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER}/api/industry/getone`,
          { _id }
        );
        setData(response.data);
        const response1 = await axios.post(
          `${import.meta.env.VITE_SERVER}/api/zone`,
          {
            zone_id: response.data.zone_id,
          }
        );
        setZone(response1.data[0]);
      } catch (err) {
        console.log("Error" + err);
      }
    };

    fetchIndustryDetails();
  }, [_id]);

  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <ToastContainer
        position="top-left"
        autoClose={2100}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {data ? (
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
          <h1 className="text-3xl font-bold mb-8 text-blue-700 text-center">
            Industry / Shed Details
          </h1>
          <div className="space-y-6">
            {/* zone details to be added aswell */}

            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Unit Name:
              </h2>
              <p className="text-xl">{data.industry_name}</p>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Industrial Area:
              </h2>
              <p className="text-xl">
                {zone ? zone.zone_name : "Waiting for network..."}
              </p>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Plot Number:
              </h2>
              <p className="text-xl">
                {data.plot_number
                  ? data.plot_number.split(" ").slice(0, -1).join(" ")
                  : "Waiting for network..."}
              </p>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Plot area:
              </h2>
              <p className="text-xl">{data.industry_area}</p>
            </div>

            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Phone Number:
              </h2>
              <p className="text-xl">{data.phone_number}</p>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Name Of Allottee:
              </h2>
              <p className="text-xl">{data.name}</p>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Total Number of Employees:
              </h2>
              <p className="text-xl">{data.no_of_employees}</p>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Number of Himachali Employees:
              </h2>
              <p className="text-xl">{data.no_of_employees_HIM}</p>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Item Manufactured:
              </h2>
              <p className="text-xl">{data.item_manufactured}</p>
            </div>

            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-700">Email ID:</h2>
              <a
                href={`mailto:${data.email}`}
                className="flex items-center text-purple-800"
              >
                <FaEnvelope className="mr-1" />
                <p className="text-xl">{data.email}</p>
              </a>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-700">Lessee:</h2>
              <p className="text-xl">{data.lessee}</p>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-700">GSTIN:</h2>
              <p className="text-xl">{data.gstin_number}</p>
            </div>
          </div>
          <div className="flex space-x-4 mt-8 justify-between">
            <button
              onClick={handleGoBack}
              className="bg-slate-500 text-white py-2 px-6 rounded-lg hover:bg-slate-600 transition duration-300"
            >
              Go Back
            </button>
          </div>
        </div>
      ) : (
        <div className="text-xl text-gray-600">No industry details found.</div>
      )}
    </div>
  );
};

export default Maindustrydetails;
