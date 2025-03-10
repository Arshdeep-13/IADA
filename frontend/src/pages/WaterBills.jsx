import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "universal-cookie";
import axios from "axios";
import { FaIndustry } from "react-icons/fa";
import TermsModal from "../components/TermsModal";

const WaterBills = ({ onPayNow }) => {
  const [userData, setUserData] = useState({});
  const [termsAndConditions, setTermsAndConditions] = useState(false);
  const cookies = new Cookies();
  const [bill, setBill] = useState({});
  const [finance, setFinance] = useState({});
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [meterLess, setMeterLess] = useState(false);
  const [editModal, setEditModal] = useState(false);

  useEffect(() => {
    fetchdata();
  }, []);
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const fetchdata = async () => {
    setLoading(true);
    const resp = await axios.get(
      `${import.meta.env.VITE_SERVER}/api/finances/getfinances`
    );
    setFinance(resp.data);
    const email = cookies.get("email");
    const zone_id = cookies.get("zone_id");
    const res = await axios.post(
      `${import.meta.env.VITE_SERVER}/api/finances/fetchbill`,
      { email, zone_id }
    );
    const user = await axios.get(
      `${import.meta.env.VITE_SERVER}/api/industry/getIndustryData`,
      {
        headers: {
          authorization: `Bearer ${cookies.get("token")}`,
        },
      }
    );
    setUserData(user?.data);
    setBill(res?.data);
    if (res?.data?.meterNo == "0") {
      setMeterLess(true);
    }
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
  const handleEditClick = () => {
    setEditModal(true);
    document.getElementById("editModal").showModal();
  };
  const handleCloseEdit = () => {
    document.getElementById("editModal").close();
  };
  const normalFormatDate = (d) => {
    let res = new Date(d);
    let day = res.getUTCDate();
    let month = res.getUTCMonth() + 1;
    let year = res.getUTCFullYear();

    return `${day}-${month}-${year}`;
  };
  const submitHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      async function handlePayment() {
        let res = await fetch(
          `${import.meta.env.VITE_SERVER}/generate-encrypted-url`,
          {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: bill.currentTotal }),
          }
        );
        res = await res.json();
        const decryptedUrl = decodeURIComponent(res.encryptedUrl);
        window.open(decryptedUrl, "_blank");

        // polling for payment status
        const interval = setInterval(async () => {
          const res = await fetch(
            `${import.meta.env.VITE_SERVER}/waterbill-payment/processing`,
            {}
          );
          if (res.ok) {
            clearInterval(interval);
          }
        }, 1000);
      }
      handlePayment();
    } catch (error) {
      toast.error("Error during checkout: " + error.message, {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <TermsModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        finance={finance || ""}
      />

      <div className="mx-auto flex items-center justify-center z-50 ">
        {/* TERMS AND CONDITIONS */}
        <dialog id="editModal" className="modal">
          <div className="modal-box px-10">
            <form method="dialog">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={handleCloseEdit}
              >
                ✕
              </button>
              <h1 className="text-xl text-center font-bold mb-3">
                Terms and Conditions
              </h1>
              <div>
                <p className="text-justify mb-2">
                  If the payment of this bill is not made within{" "}
                  <b>3 months </b>from the its due date, the water supply to
                  your premises will be disconnected without further notice.
                </p>
                <p className="text-justify mb-2">
                  Payment will be accepted in the form of
                  <b> NEFT, UPI, Debit / Credit Card </b>.
                </p>

                <p className="text-justify">
                  The bills for a particular area are normally issued on the
                  Fixed dates and in case of non-receipt of the bill within a
                  week of the said fix date, it shall be the responsibility of
                  the consumer to ascertain from the local office of the
                  Industries whether the bill has been issued or not and to make
                  the payment in time.
                </p>
              </div>
            </form>
          </div>
        </dialog>

        {/* ACTUAL WATER BILL */}
        <div className="mt-7 ml-4 mr-4 md:ml-0 md:mr-0 bg-white border border-gray-200 rounded-xl shadow-2xl dark:bg-neutral-900 dark:border-neutral-700 w-screen md:w-auto">
          <div className="p-4 sm:p-7 flex flex-col justify-center items-center w-auto">
            <div className="text-center">
              <h1 className="block text-2xl pb-3 font-semibold text-gray-800 dark:text-white">
                Water Bill{" "}
              </h1>
              <h2 className="block text-xl font-semibold text-gray-800 dark:text-white pb-2">
                Industrial Area Development Agency SWCA Baddi (H.P.) <br />
              </h2>
              <div className="grid gap-y-4 md:gap-y-0 md:flex md:mt-5 md:items-center md:justify-between">
                {/* BILL NO. */}
                <div>
                  <label
                    htmlFor="no"
                    className="flex font-semibold text-sm mb-2 dark:text-white"
                  >
                    Bill No.
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      disabled
                      value={bill.no || ""}
                      id="no"
                      name="no"
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    />
                  </div>
                </div>
                {/* BILL DATE */}
                <div>
                  <label
                    htmlFor="date"
                    className="flex font-semibold text-sm mb-2 dark:text-white"
                  >
                    Date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={normalFormatDate(bill.date) || ""}
                      disabled
                      id="date"
                      name="date"
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 w-full">
              <form>
                <div className="grid gap-y-4">
                  {/* user details */}
                  <div>
                    <label
                      htmlFor="consumerNo"
                      className="block font-semibold text-sm mb-2 dark:text-white"
                    >
                      Consumer No.
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={bill.consumerNo || ""}
                        disabled
                        id="consumerNo"
                        name="consumerNo"
                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      />
                      <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                        <svg
                          className="size-5 text-red-500"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                          aria-hidden="true"
                        >
                          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {meterLess && (
                    <div>
                      <label
                        htmlFor="area"
                        className="block font-semibold text-sm mb-2 dark:text-white"
                      >
                        Area
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={userData.industry_area || ""}
                          disabled
                          id="area"
                          name="area"
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        />
                        <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                          <svg
                            className="size-5 text-red-500"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            aria-hidden="true"
                          >
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                  {!meterLess && (
                    <div>
                      <label
                        htmlFor="meterNo"
                        className="block font-semibold text-sm mb-2 dark:text-white"
                      >
                        Meter No.
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={bill.meterNo || ""}
                          disabled
                          id="meterNo"
                          name="meterNo"
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        />
                        <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                          <svg
                            className="size-5 text-red-500"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            aria-hidden="true"
                          >
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="consumerName"
                      className="block font-semibold text-sm mb-2 dark:text-white"
                    >
                      Name of Consumer
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={bill.consumerName || ""}
                        disabled
                        id="consumerName"
                        name="consumerName"
                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      />
                      <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                        <svg
                          className="size-5 text-red-500"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                          aria-hidden="true"
                        >
                          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="premises"
                      className="block font-semibold text-sm mb-2 dark:text-white"
                    >
                      Premises
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={bill.premises || ""}
                        disabled
                        id="premises"
                        name="premises"
                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      />
                      <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                        <svg
                          className="size-5 text-red-500"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                          aria-hidden="true"
                        >
                          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {!meterLess && (
                    <div>
                      <div className="flex flex-col mb-2">
                        <p className="block text-md font-semibold mb-2 dark:text-white">
                          Meter Readings
                        </p>
                        <div className="flex gap-2 justify-between">
                          <div className="relative w-1/2">
                            <label
                              htmlFor="startRangeMeterReading"
                              className="block text-sm mb-2 dark:text-white"
                            >
                              From
                            </label>
                            <input
                              type="text"
                              value={
                                bill.readingsFrom
                                  ? bill.readingsFrom.split("T")[0]
                                  : "" || ""
                              }
                              disabled
                              id="startRangeMeterReading"
                              name="startRangeMeterReading"
                              className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                            />
                            <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                              <svg
                                className="size-5 text-red-500"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                                aria-hidden="true"
                              >
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                              </svg>
                            </div>
                          </div>
                          <div className="relative w-1/2">
                            <label
                              htmlFor="endRangeMeterReading"
                              className="block text-sm mb-2 dark:text-white"
                            >
                              To
                            </label>
                            <input
                              type="text"
                              disabled
                              value={
                                bill.readingsTo
                                  ? bill.readingsTo.split("T")[0]
                                  : "" || ""
                              }
                              id="endRangeMeterReading"
                              name="endRangeMeterReading"
                              className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                            />
                            <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                              <svg
                                className="size-5 text-red-500"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                                aria-hidden="true"
                              >
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col mb-2">
                        <p className="block text-md font-semibold mb-2 dark:text-white">
                          Consumption Units
                        </p>
                        <div className="flex gap-2 justify-between">
                          <div className="relative w-1/2">
                            <label
                              htmlFor="oldConsumptionUnits"
                              className="block text-sm mb-2 dark:text-white"
                            >
                              Old
                            </label>
                            <input
                              type="text"
                              disabled
                              value={bill.startRangeMeterReading || ""}
                              id="oldConsumptionUnits"
                              name="oldConsumptionUnits"
                              className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                            />
                            <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                              <svg
                                className="size-5 text-red-500"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                                aria-hidden="true"
                              >
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                              </svg>
                            </div>
                          </div>
                          <div className="relative w-1/2">
                            <label
                              htmlFor="newConsumptionUnits"
                              className="block text-sm mb-2 dark:text-white"
                            >
                              New
                            </label>
                            <input
                              type="text"
                              disabled
                              value={bill.endRangeMeterReading || ""}
                              id="newConsumptionUnits"
                              name="newConsumptionUnits"
                              className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                            />
                            <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                              <svg
                                className="size-5 text-red-500"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                                aria-hidden="true"
                              >
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 justify-between">
                    <div className="relative w-1/2">
                      <label
                        htmlFor="rsPerKl"
                        className="block font-semibold text-sm mb-2 dark:text-white"
                      >
                        Rate per KiloLitre (Rs)
                      </label>
                      <input
                        type="text"
                        disabled
                        value={finance.permaConnectionRatePerKL || ""}
                        id="rsPerKl"
                        name="rsPerKl"
                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      />
                      <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                        <svg
                          className="size-5 text-red-500"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                          aria-hidden="true"
                        >
                          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="relative w-1/2">
                      <label
                        htmlFor="amount1"
                        className="block font-semibold text-sm mb-2 dark:text-white"
                      >
                        Current Total (Rs)
                      </label>
                      <input
                        type="text"
                        value={bill.amountPayOnDueDate || ""}
                        disabled
                        id="amount1"
                        name="amount1"
                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      />
                      <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                        <svg
                          className="size-5 text-red-500"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                          aria-hidden="true"
                        >
                          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 justify-between">
                      <div className="relative w-1/2">
                        <label
                          htmlFor="Arrears"
                          className="block font-semibold text-sm  dark:text-white"
                        >
                          Arrears (Rs)
                        </label>
                        <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                          <svg
                            className="size-5 text-red-500"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            aria-hidden="true"
                          >
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                          </svg>
                        </div>

                        <input
                          type="text"
                          value={bill.arrears || ""}
                          disabled
                          id="amount2"
                          name="amount2"
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        />
                        <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                          <svg
                            className="size-5 text-red-500"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            aria-hidden="true"
                          >
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                          </svg>
                        </div>
                      </div>
                      <div className="relative w-1/2">
                        <label
                          htmlFor="SewerageCharges"
                          className="block font-semibold text-sm  dark:text-white"
                        >
                          Sewerage Charges (Rs)
                        </label>
                        <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                          <svg
                            className="size-5 text-red-500"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            aria-hidden="true"
                          >
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                          </svg>
                        </div>

                        <input
                          type="text"
                          value={bill.sewerageCharges || ""}
                          disabled
                          id="sewerageCharges"
                          name="sewerageCharges"
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        />
                        <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                          <svg
                            className="size-5 text-red-500"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            aria-hidden="true"
                          >
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 justify-between">
                      <div className="relative">
                        <label
                          htmlFor="dueDate"
                          className="block font-semibold text-sm mb-2 dark:text-white"
                        >
                          Due Date
                        </label>
                        <input
                          type="text"
                          value={normalFormatDate(bill.dueDate) || ""}
                          disabled
                          id="dueDate"
                          name="dueDate"
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        />
                        <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                          <svg
                            className="size-5 text-red-500"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            aria-hidden="true"
                          >
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                          </svg>
                        </div>
                      </div>
                      <div className="relative">
                        <label
                          htmlFor="totalAmount"
                          className="block font-semibold text-sm mb-2 dark:text-white"
                        >
                          Amount Payable On Due Date (Rs)
                        </label>
                        <input
                          type="text"
                          disabled
                          value={bill.currentTotal || ""} // total=current bill,arrears=arrears,beforedue=current bill+arrears
                          id="totalAmount"
                          name="totalAmount"
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        />
                        <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                          <svg
                            className="size-5 text-red-500"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            aria-hidden="true"
                          >
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="latePaymentSurcharge"
                      className="block font-semibold text-sm mb-2 dark:text-white"
                    >
                      Late Payment Surcharge (Rs)
                    </label>
                    <input
                      type="text"
                      value={bill.latePaymentSurcharge || ""}
                      disabled
                      id="latePaymentSurcharge"
                      name="latePaymentSurcharge"
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    />
                    <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                      <svg
                        className="size-5 text-red-500"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                      >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="amountAfterDueDate"
                      className="block font-semibold text-sm mb-2 dark:text-white"
                    >
                      Amount Payable After Due Date (Rs)
                    </label>
                    <input
                      type="text"
                      disabled
                      value={bill.amountPayAfterDueDate || ""}
                      id="amountAfterDueDate"
                      name="amountAfterDueDate"
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    />
                    <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                      <svg
                        className="size-5 text-red-500"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                      >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="calculatedFinalBill"
                      className="block font-bold text-lg mb-2 dark:text-white"
                    >
                      Total Amount (Rs)
                    </label>
                    <input
                      type="text"
                      disabled
                      value={bill.currentTotal || ""}
                      id="currentTotal"
                      name="currentTotal"
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    />
                    <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                      <svg
                        className="size-5 text-red-500"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                      >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="termsAndConditions"
                      id="termsAndConditions"
                      required
                      onChange={(e) => setTermsAndConditions(e.target.checked)}
                    />
                    <label htmlFor="termsAndConditions">
                      I agree to the{" "}
                      <span
                        onClick={handleEditClick}
                        className="text-blue-600 cursor-pointer hover:underline"
                      >
                        Terms And Conditions
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
                    onClick={termsAndConditions ? submitHandler : null}
                  >
                    Pay Now
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WaterBills;
