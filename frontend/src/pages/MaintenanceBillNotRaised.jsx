import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TermsModal from "../components/TermsModal";
import axios from "axios";
import { FaIndustry } from "react-icons/fa"; // Don't forget to import the spinner icon if you're using it

const MaintenanceBillNotRaised = () => {
  const navigate = useNavigate();
  const [finance, setFinance] = useState({});
  const [loading, setLoading] = useState(true); // Initially loading is true
  const [isModalOpen, setIsModalOpen] = useState(true);

  const fetchData = async () => {
    const resp = await axios.get(
      `${import.meta.env.VITE_SERVER}/api/finances/getmtcfinances`
    );
    setFinance(resp.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBackClick = () => {
    navigate(-1);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const currentDate = new Date();
  const { billRaisingMonth, billRaisingDate } = finance;

  // If billRaisingMonth and billRaisingDate exist
  let nextDate = new Date(currentDate.getFullYear(), billRaisingMonth - 1, billRaisingDate);

  // Check if the current date has passed the bill raising date for the current year
  if (currentDate > nextDate) {
    // If it's passed, set next year's date
    nextDate = new Date(currentDate.getFullYear() + 1, billRaisingMonth - 1, billRaisingDate);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaIndustry className="animate-spin mr-2 text-4xl" />
        Loading bill...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <TermsModal isModalOpen={isModalOpen} closeModal={closeModal} finance={finance} />
      <div className="max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Maintenance Bill Not Raised Yet
        </h2>
        <p className="text-gray-600 mb-4">
          The Maintenance bill has not been uploaded yet. Please check back later on{" "}
          {nextDate.toDateString()}
        </p>
        <button
          onClick={handleBackClick}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default MaintenanceBillNotRaised;
