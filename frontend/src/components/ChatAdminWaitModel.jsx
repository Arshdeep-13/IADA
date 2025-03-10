import React from "react";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import CryptoJS from "crypto-js";
import Cookies from "universal-cookie";

const ChatAdminWaitModel = ({ isModalOpen, closeModal, whoClose }) => {
  const cookies = new Cookies();

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Chat Closed"
      ariaHideApp={false}
      className="fixed inset-0 flex items-center justify-center p-4"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="flex flex-col justify-center items-center h-screen bg-cover bg-fixed  backdrop-blur-sm  w-full">
        <div className="text-xl p-8 rounded-xl flex flex-col items-center justify-center bg-white dark:bg-neutral-800 shadow-lg transition-transform transform hover:scale-105">
          Your response has been recorded, wait for{" "}
          <span className="contents text-red-700">{whoClose}</span> admin to
          open the chat
        </div>

        {isModalOpen && (
          <div className="bg-opacity-50 flex justify-left  ">
            <Link
              to={`/services/admins/${cookies.get("zone_id")}/zonaladmin`}
              className="text-center mt-4 bg-blue-500 text-white px-4 py-2  w-24 rounded hover:bg-blue-600"
            >
              Back
            </Link>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ChatAdminWaitModel;
