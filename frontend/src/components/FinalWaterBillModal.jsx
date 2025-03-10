import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "universal-cookie";

const FinalWaterBillModal = ({ showBillModal, setShowBillModal, premises }) => {
  const cookies = new Cookies();
  const [billData, setBillData] = useState({
    no: "",
    date: "",
    consumerNo: "",
    meterNo: "",
    consumerName: "",
    premises: "",
    startRangeMeterReading: "",
    endRangeMeterReading: "",
    readingsFrom: "",
    readingsTo: "",
    rsPerKl: "",
    arrears: "",
    dueDate: "",
    amountPayOnDueDate: "",
    amountPayAfterDueDate: "",
    currentTotal: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showBillModal) {
      fetchBillData();
    }
  }, [showBillModal]);

  const fetchBillData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/api/finances/getone`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${cookies.get("token")}`,
          },
          body: JSON.stringify({ premises }),
        }
      );

      const data = await response.json();
      const formattedData = formatDatesInBillData(data);
      setBillData(formattedData);
    } catch (error) {
      console.error("Error fetching bill data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/api/finances/updateone`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${cookies.get("token")}`,
          },
          body: JSON.stringify(billData),
        }
      );

      if (response.ok) {
        toast.success("Bill data updated successfully!");
        setTimeout(() => {
          setShowBillModal(false);
        }, 2000); // Delay of 2 seconds
      } else {
        toast.error("Error updating bill data");
      }
    } catch (error) {
      toast.error("Error updating bill data");
      console.error("Error updating bill data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const formatDate = (dateObj) => {
    return dateObj.split("T")[0];
  };

  const formatDatesInBillData = (data) => {
    return {
      ...data,
      date: formatDate(data.date),
      dueDate: formatDate(data.dueDate),
      readingsFrom: formatDate(data.readingsFrom),
      readingsTo: formatDate(data.readingsTo),
    };
  };

  if (!showBillModal) return null;

  return (
    <div className="inset-0 fixed flex items-center justify-center z-50">
      <ToastContainer />
      <div className="absolute h-screen w-full md:w-screen bg-black opacity-50"></div>
      <div className="bg-blue-50 w-auto rounded-lg py-5 px-6 relative z-10 max-w-lg mx-4 overflow-y-auto h-screen mt-7">
        <h1 className="flex justify-center items-center font-bold text-2xl md:text-3xl mb-5">
          Edit Water Bill
        </h1>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="loader border-t-4 border-b-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(billData).map((key) => (
                <div key={key} className="flex flex-col">
                  <label className="mb-1 capitalize font-semibold">
                    {key.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="text"
                    name={key}
                    value={billData[key]}
                    onChange={handleChange}
                    placeholder={key}
                    className="border rounded p-2"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4 py-5">
              <button
                type="button"
                className="bg-gray-500 text-white px-6 py-2 rounded-lg mr-2 hover:bg-gray-600 transition duration-200"
                onClick={() => setShowBillModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FinalWaterBillModal;
