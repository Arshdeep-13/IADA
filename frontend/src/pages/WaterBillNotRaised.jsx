import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TermsModal from "../components/TermsModal";
import axios from "axios";

const WaterBillNotRaised = () => {
  const navigate = useNavigate();
  const [finance, setFinance] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchdata = async () => {
    const resp = await axios.get(
      // api call for fetching h20 finances
      `${import.meta.env.VITE_SERVER}/api/finances/getfinances`
    );
    setFinance(resp.data);
    setLoading(false);
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaIndustry className="animate-spin mr-2 text-4xl" />
        Loading bill...
      </div>
    );
  }

  useEffect(() => {
    fetchdata();
  }, []);

  const handleBackClick = () => {
    navigate(-1);
  };
  const [isModalOpen, setIsModalOpen] = useState(true);

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const currentDate = new Date();
  let nextDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    finance.billRaisingDate
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <TermsModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        finance={finance}
      />
      <div className="max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Water Bill Not Raised Yet
        </h2>
        <p className="text-gray-600 mb-4">
          The water bill has not been uploaded yet. Please check back later on{" "}
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

export default WaterBillNotRaised;
