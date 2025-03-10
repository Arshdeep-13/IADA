import React from "react";
import { REGISTRAION_TERMS } from "../../utils/constants";

const RegistrationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-center">
          Terms and Conditions
        </h2>

        <p className="mt-4">{REGISTRAION_TERMS}</p>
      </div>
    </div>
  );
};

export default RegistrationModal;
