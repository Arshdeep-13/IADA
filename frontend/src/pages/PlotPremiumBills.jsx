import React, { useState } from "react";
import Modal from "react-modal";
import { TERMS_CONDITION_PAGES } from "../../utils/constants";

const PlotPremiumBills = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPage(0); // Reset to first page when modal is closed
  };

  const nextPage = () => {
    if (currentPage < TERMS_CONDITION_PAGES.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-4">
      <label className="flex items-center space-x-2">
        <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
        <span>
          I agree to the{" "}
          <span
            onClick={openModal}
            className="text-blue-500 underline cursor-pointer"
          >
            terms and conditions
          </span>.
        </span>
      </label>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Terms and Conditions"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto max-h-screen overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Terms and Conditions</h2>
          <div className="text-sm text-gray-700 mb-4">
            {TERMS_CONDITION_PAGES[currentPage].split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
          <div className="flex justify-between">
            <button
              onClick={previousPage}
              disabled={currentPage === 0}
              className={`px-4 py-2 rounded ${currentPage === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
            >
              Previous
            </button>
            <button
              onClick={nextPage}
              disabled={currentPage === TERMS_CONDITION_PAGES.length - 1}
              className={`px-4 py-2 rounded ${currentPage === TERMS_CONDITION_PAGES.length - 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
            >
              Next
            </button>
          </div>
          <button
            onClick={closeModal}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default PlotPremiumBills;
