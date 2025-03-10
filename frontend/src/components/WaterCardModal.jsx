import React from "react";
import Modal from "react-modal";
import { Link } from "react-router-dom";

const WaterCardModal = ({ isModalOpen, closeModal, isBillDue }) => {
  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Check paid bills"
      ariaHideApp={false}
      className="fixed inset-0 flex items-center justify-center p-4"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="flex justify-center items-center h-screen bg-cover bg-fixed  backdrop-blur-sm  w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-2/3">
          <Link
            to={isBillDue==="true" ? "/waterbill" : "/waterbillnotraised"}
            className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white"
          >
            <div className="hover:scale-105 p-5 md:p-6 rounded-xl flex flex-col items-center justify-center bg-white dark:bg-neutral-800 shadow-lg transition-transform transform text-center md:text-left">
              Pay Water Bill
            </div>
          </Link>
          <Link
            to={"/services/payment-history"}
            className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white"
          >
            <div className="hover:scale-105 p-5 md:p-6 rounded-xl flex flex-col items-center justify-center bg-white dark:bg-neutral-800 shadow-lg transition-transform transform text-center md:text-left">
              Check Previous Water Bills
            </div>
          </Link>

          {isModalOpen && (
            <div className="bg-opacity-50 flex justify-left text-lg">
              <button
                onClick={closeModal}
                className="mt-4 bg-blue-500 text-white px-4 py-2  w-24 rounded hover:bg-blue-600"
              >
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default WaterCardModal;
