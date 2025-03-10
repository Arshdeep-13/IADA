import React, { useState } from "react";
import DataTable from "react-data-table-component";

import { ToastContainer, toast } from "react-toastify";

const Adminwaterbilltable = ({ bills }) => {
  const columns = [
    {
      name: "Date",
      selector: (bills) => new Date(bills.date).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Premises",
      selector: (bills) => bills.premises,
      sortable: true,
    },
    {
      name: "Old Consumption Units",
      selector: (bills) => bills.startRangeMeterReading,
      sortable: true,
    },
    {
      name: "New Consumption Units",
      selector: (bills) => bills.endRangeMeterReading,
      sortable: true,
    },
    {
      name: "Rate per Liter",
      selector: (bills) => bills.rsPerKl,
      sortable: true,
    },
    {
      name: "Meter No",
      selector: (bills) => bills.meterNo,
      sortable: true,
    },
    {
      name: "Due Date",
      selector: (bills) => new Date(bills.dueDate).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Amount",
      selector: (bills) => bills.amountPayOnDueDate,
      sortable: true,
    },
  ];

  const customStyles = {
    header: {
      style: {
        fontFamily: "Sans-serif",
        fontSize: "24px",
        fontWeight: "bold",
        color: "#1e40af", // Tailwind's blue-800
        textAlign: "center",
        padding: "20px",
      },
    },
    headRow: {
      style: {
        backgroundColor: "#bfdbfe",
        fontFamily: "Sans-serif",
        fontSize: "18px",
        fontWeight: "600",
        color: "#1e3a8a",
        borderBottom: "2px solid #93c5fd",
      },
    },
    headCells: {
      style: {
        fontSize: "16px",
        fontFamily: "Sans-serif",
        fontWeight: "600",
        color: "#1e3a8a",
        padding: "12px",
      },
    },
    rows: {
      style: {
        fontFamily: "Baloo Bhai 2, cursive",
        fontSize: "18px",
        color: "#1e3a8a",
        borderBottom: "1px solid #bfdbfe",
        padding: "12px",
        "&:hover": {
          backgroundColor: "#e0f2fe",
          cursor: "pointer",
        },
      },
    },
    pagination: {
      style: {
        fontFamily: "Sans-serif",
        fontSize: "16px",
        fontWeight: "500",
        color: "#1e40af",
        padding: "10px",
        backgroundColor: "#eff6ff",
        borderTop: "1px solid #93c5fd",
      },
    },
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1100}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="mt-14">
        <DataTable
          customStyles={customStyles}
          className="dataTables_wrapper"
          columns={columns}
          data={bills}
          pagination
          responsive
          highlightOnHover
          pointerOnHover
        />
      </div>
    </>
  );
};

export default Adminwaterbilltable;
