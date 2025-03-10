import React, { useState, useEffect } from "react";
import Modal from "react-modal";

const TermsModal = ({ isModalOpen, closeModal, finance }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (finance) {
      setIsLoading(false); // Stop loading once finance data is available
    }
  }, [finance]);

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Terms and Conditions"
      ariaHideApp={false}
      className="fixed inset-0 flex items-center justify-center p-4"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="loader border-t-4 border-blue-500 border-solid rounded-full w-12 h-12 animate-spin"></div>
        </div>
      ) : (
        <div
          className="bg-white rounded-lg shadow-lg p-6 mx-auto max-h-[90vh] overflow-y-auto mt-7"
          style={{ width: "800px" }}
        >
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">
            Understand Our Water Bill Rates and Policies
          </h2>
          <p className="mb-4">Dear Valued Customer,</p>
          <p className="mb-4 text-justify">
            We are committed to providing you with a clear understanding of our
            water billing structure, ensuring that you are well-informed about the
            rates, benefits, and penalties associated with your water usage. Below
            are the key attributes related to your water bill:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>
              <b>Goods and Services Tax (GST) :</b> The applicable GST rate for
              water services is <b>{finance.gst}%</b>.
            </li>
            <li>
              <b>Permanent Connection Rate :</b> The rate for water usage by
              permanent connections is{" "}
              <b>{finance.permaConnectionRatePerKL} Rs/kL</b>.
            </li>
            <li>
              <b>Temporary Connection Rate :</b> The rate for water usage by
              temporary connections is{" "}
              <b>{finance.tempConnectionRatePerKL} Rs/KL</b>.
            </li>
            <li>
              <b>New Connection Fee:</b> A one-time fee of{" "}
              <b>{finance.newConnectionFee} Rs</b> is charged for setting up a
              new water connection.
            </li>
            <li>
              <b>Sewerage Connection Fee:</b> A one-time fee of{" "}
              <b>{finance.sewerageFee} Rs</b> is charged for setting up a new
              water connection.
            </li>
            <li>
              <b>Minimum Fee:</b> A minimum fee of{" "}
              <b>{finance.minimumPayment} Rs</b> is charged if the connection is
              active and not/less used.
            </li>
            <li>
              <b>Bill Raising Duration:</b> Bills are generated and
              <b>
                {" "}
                issued on day {finance.billRaisingDate} of every{" "}
                {finance.duration} month(s)
              </b>{" "}
              to ensure timely payments and accurate tracking of your water usage.
            </li>
          </ul>
          <p className="mb-4">
            <strong>Penalties for Late Payment</strong>: To maintain fairness and
            encourage timely payments, penalties are applied for overdue bills:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>
              <b>Late Payment Fine:</b> A fine of{" "}
              <b>{finance.latePaymentFine} %</b> of the outstanding amount will be
              added to your bill if not paid within{" "}
              <b>{finance.lateBillAfter} month(s)</b> of issuance.
            </li>
          </ul>
          <p className="mb-4 text-justify">
            We hope this information clarifies our billing structure and
            encourages prompt payment to avoid any inconveniences. Should you have
            any further questions or require assistance, please do not hesitate to
            contact our customer service team.
          </p>
          <p className="mb-4">
            Thank you for your cooperation and understanding.
          </p>
          <p className="mb-4">
            <strong>Sincerely,</strong>
          </p>
          <p className="mb-4">
            <strong>IADA</strong>
          </p>
          <button
            onClick={closeModal}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      )}
    </Modal>
  );
};

export default TermsModal;
