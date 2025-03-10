import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
import ZadminAlertModal from "../components/ZadminAlertModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEnvelope } from "react-icons/fa";
import FinalWaterBillModal from "../components/FinalWaterBillModal";

const IndustryDetails = () => {
  const [showModal, setShowModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);

  const addAlert = (newAlert) => {
    axios
      .post(
        `${import.meta.env.VITE_SERVER}/api/news/${_id}`,
        { ...newAlert, zone_id },
        { headers: { Authorization: `Bearer ${cookies.get("token")}` } }
      )
      .then((response) => {
        if (response.status === 201) {
          toast.success("Alert added successfully", {
            position: "top-left",
            autoClose: 1100,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
      })
      .catch((error) => {
        toast.error("Error adding Alert", {
          position: "top-left",
          autoClose: 1100,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        console.error("Error adding Alert:", error);
      });
  };

  const cookies = new Cookies();
  const { _id } = useParams();
  const navigate = useNavigate();
  const [industry, setIndustry] = useState(null);
  const [premises, setPremises] = useState(null);
  const [zone, setZone] = useState(null);
  const [loadingIndustry, setLoadingIndustry] = useState(true);
  const [loadingZone, setLoadingZone] = useState(true);
  const [error, setError] = useState(null);
  var zone_id = cookies.get("zone_id");

  useEffect(() => {
    const fetchIndustryDetails = async () => {
      setLoadingIndustry(true);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER}/api/industry/getone`,
          { _id },
          {
            headers: {
              authorization: `Bearer ${cookies.get("token")}`,
            },
          }
        );
        setIndustry(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoadingIndustry(false);
      }
    };

    fetchIndustryDetails();
  }, [_id]);

  useEffect(() => {
    if (industry) {
      setPremises(industry.plot_number);
    }
  }, [industry]);

  useEffect(() => {
    const fetchZoneDetails = async () => {
      setLoadingZone(true);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER}/api/zone`,
          {
            zone_id,
          },
          {
            headers: {
              authorization: `Bearer ${cookies.get("token")}`,
            },
          }
        );
        setZone(response.data[0]);
      } catch (err) {
        setError(err);
      } finally {
        setLoadingZone(false);
      }
    };

    if (zone_id) {
      fetchZoneDetails();
    }
  }, [zone_id]);

  if (zone_id === "undefined") {
    zone_id = cookies.get("selected_zone");
  }

  if (loadingIndustry || loadingZone)
    return (
      <div className="flex items-center justify-center h-screen text-xl text-gray-600">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-xl text-red-600">
        Error loading details: {error.message}
      </div>
    );

  const handleGoBack = () => {
    navigate(-1);
  };
  cookies.remove("selected_zone");

  const handleDeleteIndustry = async (indusID, indusName) => {
    try {
      const cnfm = window.confirm(
        `This will remove the data of ${indusName}. Are you sure?`
      );
      if (cnfm) {
        const response = await axios.delete(
          `${
            import.meta.env.VITE_SERVER
          }/api/industry/delete?industry_id=${indusID}`,
          {
            headers: {
              Authorization: `Bearer ${cookies.get("token")}`,
            },
          }
        );
        if (response.status === 200) {
          navigate("/industries"); // Navigate to the industries list page after deletion
        }
      }
    } catch (error) {
      console.log(error);
    }
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
      <FinalWaterBillModal
        showBillModal={showBillModal}
        setShowBillModal={setShowBillModal}
        premises={premises}
      />
      {industry ? (
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-8 text-blue-700 text-center">
            Industry / Shed Details
          </h1>
          <div className="space-y-6">
            {/* zone details to be added aswell */}

            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Unit Name:
              </h2>
              <p className="text-xl">{industry.industry_name}</p>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Industry Head:
              </h2>
              <p className="text-xl">{industry.name}</p>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Industrial Area:
              </h2>
              <p className="text-xl">{zone.zone_name}</p>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Plot Number:
              </h2>
              <p className="text-xl">
                {industry.plot_number.split(" ").slice(0, -1).join(" ")}
              </p>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Plot area:
              </h2>
              <p className="text-xl text-end">{industry.industry_area}</p>
            </div>

            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Phone Number:
              </h2>
              <p className="text-xl">{industry.phone_number}</p>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Name Of Allottee:
              </h2>
              <p className="text-xl">{industry.name}</p>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Total Number of Employees:
              </h2>
              <p className="text-xl">{industry.no_of_employees}</p>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Number of Himachali Employees:
              </h2>
              <p className="text-xl">{industry.no_of_employees_HIM}</p>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Item Manufactured:
              </h2>
              <p className="text-xl">{industry.item_manufactured}</p>
            </div>

            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-700">Email ID:</h2>
              <a
                href={`mailto:${industry.email}`}
                className="flex items-center text-purple-800"
              >
                <FaEnvelope className="mr-1" />
                <p className="text-xl break-all">{industry.email}</p>
              </a>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-700">Lessee:</h2>
              <p className="text-xl">{industry.lessee}</p>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-700">GSTIN:</h2>
              <p className="text-xl">{industry.gstin_number}</p>
            </div>
          </div>
          <div className="flex md:space-x-4 mt-8 justify-evenly items-center flex-wrap md:flex-nowrap gap-3 md:gap-0">
            <div className="flex gap-4 justify-between md:justify-evenly items-center w-full md:w-1/2">
              <button
                onClick={handleGoBack}
                className="bg-slate-500 text-white py-2 px-6 rounded-lg hover:bg-slate-600 transition duration-300"
              >
                Go Back
              </button>
              {cookies.get("admin_type") === "zonal_admin" &&
                industry.is_registered && (
                  <>
                    <Link
                      className="bg-yellow-500 text-white py-2 px-6 rounded-lg hover:bg-yellow-600 transition duration-300"
                      to="#"
                      onClick={() => setShowModal(true)}
                    >
                      Send Alert
                    </Link>
                    <ZadminAlertModal
                      showModal={showModal}
                      setShowModal={setShowModal}
                      addAlert={addAlert}
                    />
                  </>
                )}
            </div>
            <div className="flex gap-4 justify-between md:justify-evenly items-center w-full md:w-1/2">
              {industry.is_registered && (
                <>
                  <button
                    className="bg-blue-500 text-white py-2 px-3 md:px-6 rounded-lg hover:bg-blue-600 transition duration-300"
                    to="#"
                    onClick={() => setShowBillModal(true)}
                  >
                    Edit Water Bill
                  </button>
                </>
              )}
              {cookies.get("admin_type") === "zonal_admin" && (
                <button
                  onClick={() =>
                    handleDeleteIndustry(industry._id, industry.industry_name)
                  }
                  className="bg-red-500 text-white py-2 px-3 md:px-6 rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Delete Industry
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-xl text-gray-600">No industry details found.</div>
      )}
    </div>
  );
};

export default IndustryDetails;
