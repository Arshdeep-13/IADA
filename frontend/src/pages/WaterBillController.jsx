import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import MasterAdminDashControl from "../components/MasterAdminDashControl";
import NewAlertModal from "../components/NewAlertModal";

const WaterBillControl = () => {
  const navigate = useNavigate();
  const cookie = new Cookies();
  const [formData, setFormData] = useState({
    gst: 0,
    permaConnectionRatePerKL: 0,
    tempConnectionRatePerKL: 0,
    newConnectionFee: 0,
    lateBillAfter: 0,
    latePaymentFine: 0,
    billRaisingDate: 1,
    duration: 0,
    sewerageFee: 0,
    minimumPayment: 0,
  });
  const [showControlPanel, setShowControlPanel] = useState(false);
  const sidebarRef = useRef(null);
  const sideBarBtnRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER}/api/finances/getfinances`
        );
        const data = response.data;
        setFormData({
          gst: data.gst || 0,
          permaConnectionRatePerKL: data.permaConnectionRatePerKL || 0,
          tempConnectionRatePerKL: data.tempConnectionRatePerKL || 0,
          newConnectionFee: data.newConnectionFee || 0,
          lateBillAfter: data.lateBillAfter || 0,
          latePaymentFine: data.latePaymentFine || 0,
          billRaisingDate: data.billRaisingDate || 1, //the date (day) when the bill will be periodically raised
          duration: data.duration || 0, //frequency or the period after which the bill will be raised on the date selected
          sewerageFee: data.sewerageFee || 0,
          minimumPayment: data.minimumPayment || 0,
        });
      } catch (error) {
        console.error("Error fetching finance data:", error);
      }
    };

    fetchFinanceData();
  }, []);

  const handleGoBack = (e) => {
    navigate(-1);
    e.preventDefault();
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Parse numerical values correctly
    const parsedFormData = {
      ...formData,
      gst: parseInt(formData.gst, 10),
      permaConnectionRatePerKL: parseInt(formData.permaConnectionRatePerKL, 10),
      tempConnectionRatePerKL: parseInt(formData.tempConnectionRatePerKL, 10),
      newConnectionFee: parseInt(formData.newConnectionFee, 10),
      lateBillAfter: parseInt(formData.lateBillAfter, 10),
      latePaymentFine: parseInt(formData.latePaymentFine, 10),
      duration: parseInt(formData.duration, 10),
      sewerageFee: parseInt(formData.sewerageFee, 10),
      minimumPayment: parseInt(formData.minimumPayment, 10),
    };

    try {
      axios.post(
        `${import.meta.env.VITE_SERVER}/api/waterbill`,
        { parsedFormData },
        {
          headers: {
            Authorization: `Bearer ${cookie.get("token")}`,
          },
        }
      );
      alert("Data saved successfully");
      navigate(-1);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };
  const handleControlClick = () => {
    setShowControlPanel(!showControlPanel);
  };
  const addUpdate = (newUpdate) => {
    axios
      .post(`${import.meta.env.VITE_SERVER}/api/news/add`, newUpdate, {
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
        },
      })
      .then((response) => {
        if (response.status === 201) {
          toast.success("Update added successfully", toastOptions);
        }
      })
      .catch((error) => {
        toast.error(
          "Error adding update. Please try again later.",
          toastOptions
        );
        console.error("Error adding update:", error);
      });
  };

  return (
    <>
      <div className="mt-4 bg-gray-100">
        <button
          id="toggle-button"
          ref={sideBarBtnRef}
          onClick={handleControlClick}
          className="p-2 bg-blue-600 text-white rounded-full shadow-lg sticky top-28 left-4 z-50 flex items-center justify-center transition-transform transform hover:scale-110"
        >
          {showControlPanel ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          )}
          Control Panel
        </button>
        <div
          className={` border-b-2 absolute top-0 left-0 h-full bg-white pt-20 md:pt-28 z-30 transition-transform duration-500 ease-in-out ${
            showControlPanel
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0"
          }`}
          ref={sidebarRef}
        >
          <MasterAdminDashControl
            setShowModal={setShowModal}
            setShowControlPanel={setShowControlPanel}
          />
        </div>
        <div className={`p-6 space-y-6 ${showControlPanel ? "blur-sm" : ""}`}>
          {showModal && (
            <NewAlertModal
              showModal={showModal}
              setShowModal={setShowModal}
              addUpdate={addUpdate}
            />
          )}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="max-w mx-16 my-11 bg-white p-8 rounded-md shadow-md"
        >
          <div className="grid grid-cols-1 gap-6">
            <div className="flex flex-col">
              <label
                htmlFor="gst"
                className="text-lg font-medium text-gray-700"
              >
                GST (%)
              </label>
              <input
                type="text"
                id="gst"
                name="gst"
                value={formData.gst}
                onChange={handleChange}
                className="mt-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="permaConnectionRatePerKL"
                className="text-lg font-medium text-gray-700"
              >
                Permanent Connection Rate/KL
              </label>
              <input
                type="text"
                id="permaConnectionRatePerKL"
                name="permaConnectionRatePerKL"
                value={formData.permaConnectionRatePerKL}
                onChange={handleChange}
                className="mt-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="tempConnectionRatePerKL"
                className="text-lg font-medium text-gray-700"
              >
                Temporary Connection Rate/KL
              </label>
              <input
                type="text"
                id="tempConnectionRatePerKL"
                name="tempConnectionRatePerKL"
                value={formData.tempConnectionRatePerKL}
                onChange={handleChange}
                className="mt-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="newConnectionFee"
                className="text-lg font-medium text-gray-700"
              >
                New Water Connection Fee (Rs)
              </label>
              <input
                type="text"
                id="newConnectionFee"
                name="newConnectionFee"
                value={formData.newConnectionFee}
                onChange={handleChange}
                className="mt-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="minimumPayment"
                className="text-lg font-medium text-gray-700"
              >
                Minimum Payment Amount (Rs)
              </label>
              <input
                type="text"
                id="minimumPayment"
                name="minimumPayment"
                value={formData.minimumPayment}
                onChange={handleChange}
                className="mt-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="lateBillAfter"
                className="text-lg font-medium text-gray-700"
              >
                Payment Date (No. Of Months After Which Bill payment is
                considered late)
              </label>
              <input
                type="text"
                id="lateBillAfter"
                name="lateBillAfter"
                value={formData.lateBillAfter}
                onChange={handleChange}
                className="mt-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="latePaymentFine"
                className="text-lg font-medium text-gray-700"
              >
                Late Payment Surcharge (%)
              </label>
              <input
                type="text"
                id="latePaymentFine"
                name="latePaymentFine"
                value={formData.latePaymentFine}
                onChange={handleChange}
                className="mt-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="sewerageFee"
                className="text-lg font-medium text-gray-700"
              >
                sewerage Fee (Rs)
              </label>
              <input
                type="text"
                id="sewerageFee"
                name="sewerageFee"
                value={formData.sewerageFee}
                onChange={handleChange}
                className="mt-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="billRaisingDate"
                className="text-lg font-medium text-gray-700"
              >
                Bill Raising Date
              </label>
              <input
                type="text"
                id="billRaisingDate"
                name="billRaisingDate"
                value={formData.billRaisingDate}
                onChange={handleChange}
                className="mt-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="duration"
                className="text-lg font-medium text-gray-700"
              >
                Raise bill after every (duration in months)
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="mt-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-row justify-between">
              <button
                onClick={handleGoBack}
                className="bg-blue-500  text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
              >
                Go Back
              </button>
              <button
                type="submit"
                className=" bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default WaterBillControl;
