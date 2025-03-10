import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

function PreviousWaterBills() {
  const [bill, setBill] = useState(null);

  const fetchBills = async () => {
    const email = cookies.get("email");
    const zone_id = cookies.get("zone_id");
    const res = await axios.post(
      `${import.meta.env.VITE_SERVER}/api/finances/fetchallbills`,
      { email, zone_id }
    );
    setBill(res.data);
  };

  useEffect(() => {
    fetchBills();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Previous Water Bills</h2>
      {bill ? (
        <div className="bg-white shadow-md rounded-lg p-4 flex flex-row gap-4 overflow-auto">
          <div className="flex items-center">
            <strong className="mr-2">No:</strong>
            <span>{bill.no}</span>
          </div>
          <div className="flex items-center">
            <strong className="mr-2">Date:</strong>
            <span>{new Date(bill.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <strong className="mr-2">Due Date:</strong>
            <span>{new Date(bill.dueDate).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center">
            <strong className="mr-2">Total Amount:</strong>
            <span> ₹ {bill.amountPayAfterDueDate}</span>
          </div>
          <div className="flex items-center">
            <strong className="mr-2">Paid:</strong>
            <span>{bill.isDue ? "No" : "Yes"}</span>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default PreviousWaterBills;
