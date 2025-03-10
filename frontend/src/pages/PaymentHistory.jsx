import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import "tailwindcss/tailwind.css";
import { FaCalendarAlt } from "react-icons/fa";
import xlsx from "json-as-xlsx";
import { AiOutlineDownload } from "react-icons/ai";
import jsPDF from "jspdf";
import SWCA_Logo from "../public/NavLogo.jpg";

const PaymentHistory = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const cookies = new Cookies();

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER}/api/finances/fetchallbills`,
          {
            email: cookies.get("email"),
            zone_id: cookies.get("zone_id"),
          }
        );
        console.log(response.data.payments);
        setBills(response.data.payments);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bills:", error);
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  // const handleExportAsXls = async () => {
  //   let data = [
  //     {
  //       sheet: "Bills",
  //       columns: [
  //         {
  //           label: "Date",
  //           value: (row) => new Date(row.date).toLocaleDateString(),
  //         },
  //         { label: "Consumer Name", value: "consumerName" },
  //         { label: "Consumer Number", value: "consumerNo" },
  //         { label: "Due", value: "isDue" },
  //         { label: "Premises", value: "premises" },
  //         { label: "Rate per Kilo Litre", value: "rsPerKl" },
  //         { label: "Meter No", value: "meterNo" },
  //         { label: "Due Date", value: "duedate" },
  //         { label: "StrtMtrReading", value: "startRangeMeterReading" },
  //         { label: "EndMtrReading", value: "endRangeMeterReading" },
  //         { label: "Amount", value: "amountPayOnDueDate" },
  //       ],
  //       content: bills.map((bill) => ({
  //         date: bill.date,
  //         consumerName: bill.consumerName,
  //         meterNo: bill.meterNo,
  //         consumerNo: bill.consumerNo,
  //         premises: bill.premises,
  //         rsPerKl: bill.rsPerKl,
  //         startMeterReading: bill.startRangeMeterReading,
  //         endMeterReading: bill.endRangeMeterReading,
  //         amountPayOnDueDate: bill.amountPayOnDueDate,
  //         duedate: bill.dueDate,
  //         Due: bill.isDue,
  //       })),
  //     },
  //   ];

  //   let settings = {
  //     fileName: `${cookies.get("username")}_Industry_Payment_History`,
  //   };

  //   xlsx(data, settings);
  // };

  const generatePDF = (bill) => {
    const doc = new jsPDF();
  
    // Logo Section
    doc.addImage(SWCA_Logo, "PNG", 10, 10, 30, 30);
  
    // Header Section
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("BILL INVOICE", 105, 20, { align: "center" });
  
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("IADA", 105, 30, { align: "center" });
    doc.text("SWCA, Baddi Distt. Solan, Himachal Pradesh 173205", 105, 38, { align: "center" });
    doc.text("PH.NO - 1795244222", 105, 45, { align: "center" });
  
    // Draw Border for the Invoice Area
    doc.setLineWidth(0.5);
    doc.rect(5, 55, 200, 230); // Full border for invoice content
  
    // Invoice and Reference Details
    let y = 65;
    doc.setFont("helvetica", "bold");
    doc.text("Invoice Details:", 10, y);
    doc.setFont("helvetica", "normal");
  
    y += 8;
    doc.text(`Date: ${bill.TransactionDate.split("T")[0]}`, 10, y); // Use the correct date
    doc.text(`Reference No: ${bill.ReferenceNo}`, 10, y + 6);
    doc.text(`Status: ${bill.ResponseCode === "E000" ? "Success" : "Failed"}`, 10, y + 24); // Correct Status
  
    // Payment Details Section (Adding new fields here)
    y += 36;
    doc.setFont("helvetica", "bold");
    doc.setFillColor(230, 230, 230); // Light grey background
    doc.rect(5, y - 5, 200, 10, "F"); // Table header background
    doc.text("Payment Mode", 10, y);
    doc.text("Processing Fee", 75, y);
    doc.text("Service Tax", 130, y);
    doc.text("Total Amount", 170, y);
  
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.rect(5, y - 5, 200, 10); // Table row border
    doc.text(`${bill.PaymentMode}`, 10, y);
    doc.text(`${bill.ProcessingFeeAmount}`, 75, y);
    doc.text(`${bill.ServiceTaxAmount}`, 130, y);
    doc.text(`₹${bill.TotalAmount}`, 170, y);
  
    // Gross Amount Section
    y += 15;
    doc.setFont("helvetica", "bold");
    doc.text("Net Amount:", 140, y);
    doc.text(`₹${bill.TransactionAmount}`, 180, y);
  
    // Footer Section
    y += 20;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text("This is a government-generated invoice for payment confirmation.", 10, y);
  
    // Save PDF
    doc.save(`invoice-${bill.ReferenceNo}.pdf`);
  };
  

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredBills = bills.filter((bill) =>
    Object.values(bill).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <button
        // onClick={handleExportAsXls}
        className="text-sm md:text-base p-2 bg-red-500 hover:bg-red-400 font-semibold text-white rounded transition duration-200"
      >
        Export as xls
      </button>
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600 flex justify-center items-center space-x-4">
        <span>Payment History</span>
        <FaCalendarAlt className="text-blue-600" />
      </h1>
      <div className="flex justify-center mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search bills..."
          className="p-2 border border-gray-300 rounded "
        />
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-6 py-3 border-b-2">Dated</th>
              <th className="px-6 py-3 border-b-2">Reference No</th>
              <th className="px-6 py-3 border-b-2">Transaction Amount</th>
              <th className="px-6 py-3 border-b-2">Status</th>
              <th className="px-6 py-3 border-b-2">Download</th>

              {/* <th className="px-6 py-3 border-b-2">Old Consumption Units</th>
              <th className="px-6 py-3 border-b-2">New Consumption Units</th>
              <th className="px-6 py-3 border-b-2">Rate per Kilo Litre</th>
              <th className="px-6 py-3 border-b-2">Meter No</th>
              <th className="px-6 py-3 border-b-2">Due Date </th>
              <th className="px-6 py-3 border-b-2">Amount </th>
              <th className="px-6 py-3 border-b-2">Due </th> */}
            </tr>
          </thead>
          <tbody>
            {filteredBills.map((bill, index) => (
              <tr
                key={index}
                className="bg-white odd:bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <td className="px-6 py-4 border-b">
                  {bill.TransactionDate.split("T")[0]} {/* Format the date */}
                </td>
                <td className="px-6 py-4 border-b">{bill.ReferenceNo}</td>
                <td className="px-6 py-4 border-b">{bill.TransactionAmount}</td>
                <td className="px-6 py-4 border-b">
                  {bill.ResponseCode === "E000" ? "Success" : "Failed"}
                </td>{" "}
                {/* Status based on ResponseCode */}
                <td className="px-6 py-4 border-b">
                  <button
                    onClick={() => generatePDF(bill)}
                    className="flex items-center justify-center text-gray-500 hover:text-gray-700"
                  >
                    <AiOutlineDownload className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
