import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
import { jsPDF } from "jspdf";
import SWCA_Logo from "../public/NavLogo.jpg";

const PaymentSuccess = () => {
  const params = new URLSearchParams(window.location.search);
  const ResponseCode = params.get("ResponseCode");
  const UniqueRefNo = params.get("UniqueRefNo");
  const ServiceTaxAmount = params.get("ServiceTaxAmount");
  const ProcessingFeeAmount = params.get("ProcessingFeeAmount");
  const TotalAmount = params.get("TotalAmount");
  const TransactionAmount = params.get("TransactionAmount");
  const TransactionDate = params.get("TransactionDate");
  const PaymentMode = params.get("PaymentMode");
  const submerchantid = params.get("submerchantid");
  const ReferenceNo = params.get("ReferenceNo");
  const ID = params.get("ID");
  const cookies = new Cookies();
  const decodedToken = jwtDecode(cookies.get("token"));
  const [industryDetails, setIndustryDetails] = useState({});

  useEffect(() => {
    const fetchIndustryDetails = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/api/industry/getone`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.get("token")}`,
          },
          body: JSON.stringify({
            _id: decodedToken.industryId,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setIndustryDetails(data);
      }
    };

    fetchIndustryDetails();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setProperties({
      title: `Invoice ${ReferenceNo}`,
      subject: "Payment Confirmation",
      author: "SWCA Baddi",
      keywords: "invoice, payment, confirmation",
      creator: "SWCA Invoice Generator",
    });

    const drawLine = (startX, startY, endX, endY) => {
      doc.setDrawColor(200, 200, 200);
      doc.line(startX, startY, endX, endY);
    };

    doc.addImage(SWCA_Logo, "PNG", 10, 12, 30, 32);

    // Bill
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 105, 25, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Industrial Area Development Agency", 105, 35, {
      align: "center",
    });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("GST IN: 02AABAI3805R1ZN | PH.NO: 1795244222", 105, 40, {
      align: "center",
    });
    doc.setFont("helvetica", "italic");
    doc.text("SWCA, Baddi Distt. Solan, Himachal Pradesh 173205", 105, 45, {
      align: "center",
    });

    drawLine(10, 50, 200, 50);
    let y = 60;
    doc.setFont("helvetica", "bold");
    doc.text("Billed To:", 10, y);
    doc.setFont("helvetica", "normal");
    y += 5;
    doc.text(industryDetails.industry_name, 10, y);
    doc.text(`GST : ${industryDetails.gstin_number}`, 10, y + 7);
    doc.text(`Phone: ${industryDetails.phone_number}`, 10, y + 14, {
      maxWidth: 90,
    });
    doc.text(`Plot Number: ${industryDetails.plot_number}`, 10, y + 21, {
      maxWidth: 90,
    });

    y = 60;
    doc.setFont("helvetica", "bold");
    doc.text("Invoice Details:", 130, y);
    doc.setFont("helvetica", "normal");
    y += 5;
    doc.text(`Date: ${TransactionDate.split("T")[0]}`, 130, y);
    doc.text(`Reference No: ${ReferenceNo}`, 130, y + 5);
    doc.text(`Invoice No: 1234`, 130, y + 10);
    doc.text(
      `Status: ${ResponseCode === "E000" ? "Success" : "Failed"}`,
      130,
      y + 15
    );

    y += 30;
    drawLine(10, y, 200, y);

    // Payment Details Section
    y += 10;
    doc.setFillColor(240, 240, 240);
    doc.rect(10, y, 190, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.text("Description", 15, y + 6);
    doc.text("Amount", 180, y + 6, { align: "right" });

    y += 15;
    doc.setFont("helvetica", "normal");
    doc.text("Net Amount", 15, y);
    doc.text(`Rs. ${TransactionAmount}`, 180, y, { align: "right" });

    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text("Service FEE", 15, y);
    doc.text(`Rs. ${ServiceTaxAmount}`, 180, y, { align: "right" });

    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text("Processing Fee", 15, y);
    doc.text(`Rs. ${ProcessingFeeAmount}`, 180, y, { align: "right" });

    y += 10;
    drawLine(10, y, 200, y);

    y += 8;
    doc.setFont("helvetica", "bold");
    doc.text("Total Amount", 15, y);
    doc.text(`Rs. ${TotalAmount}`, 180, y, { align: "right" });

    y += 15;
    doc.setFont("helvetica", "normal");
    doc.text(`Payment Method: ${PaymentMode}`, 15, y);
    // Footer Section
    y = 270;
    drawLine(10, y, 200, y);
    y += 10;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text(
      "This is a computer-generated invoice and does not require a signature.",
      105,
      y,
      { align: "center" }
    );
    doc.text(
      "For any queries, please contact our customer support.",
      105,
      y + 5,
      { align: "center" }
    );

    // Save PDF
    doc.save(`invoice-${ReferenceNo}.pdf`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-lg w-full bg-white shadow-md rounded-lg p-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-green-100 rounded-full">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Successful!
          </h1>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={generatePDF}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
