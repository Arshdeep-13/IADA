import React from "react";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import ChatAdminWaitModel from "./ChatAdminWaitModel";

const ChatAnswer = ({ isModalOpen, closeModal, whoClose, userId }) => {
  const [isWaitModalOpen, setIsWaitModalOpen] = React.useState(false);

  const openWaitModal = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER}/api/zAdmin/user-statisfied`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isSatisfied: false,
            userId: userId,
          }),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to send the request");
      }
      setIsWaitModalOpen(true);
    } catch (err) {
      console.log(err);
    }
  };

  const closeWaitModal = () => {
    setIsWaitModalOpen(false);
    closeModal();
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Chat Closed"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="flex flex-col justify-center items-center h-screen bg-cover bg-fixed backdrop-blur-sm w-full">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white text-center">
            Your chat has been closed by{" "}
            <span className="text-red-700">{whoClose}</span>
          </h1>
          <h2 className="mt-3 mb-4 text-3xl font-bold text-gray-800 dark:text-white">
            Are you satisfied?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-2/3">
            <button
              onClick={closeModal}
              className="text-3xl font-bold text-gray-800 dark:text-white"
            >
              <div className="p-8 rounded-xl flex flex-col items-center justify-center bg-white dark:bg-neutral-800 shadow-lg transition-transform transform hover:scale-105">
                Yes
              </div>
            </button>
            <button
              onClick={openWaitModal}
              className="text-3xl font-bold text-gray-800 dark:text-white"
            >
              <div className="p-8 rounded-xl flex flex-col items-center justify-center bg-white dark:bg-neutral-800 shadow-lg transition-transform transform hover:scale-105">
                No
              </div>
            </button>
          </div>
        </div>
      </Modal>

      {/* ChatWaitModel Modal */}
      <ChatAdminWaitModel
        isModalOpen={isWaitModalOpen}
        closeModal={closeWaitModal}
        whoClose={whoClose}
      />
    </>
  );
};

export default ChatAnswer;
