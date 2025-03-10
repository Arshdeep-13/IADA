import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { AiOutlineDownload } from "react-icons/ai"
import { generatePdf } from "../../../utils/generatePdf";

import { ToastContainer, toast } from "react-toastify";

const AdminPaymentsTable = ({ payments }) => {
  const columns = [
    {
      name: "Date",
      selector: (payments) => payments.TransactionDate.split("T")[0],
      sortable: true
    },
    {
      name: "Reference Number",
      selector: (payments) => payments.ReferenceNo
    },
    {
      name: "Transaction Amount",
      selector: (payments) => payments.TransactionAmount
    },
    {
      name: "Response Code",
      selector: (payments) => payments.ResponseCode == "E000" ? "Success" : "Failed"
    },
    {
      name: "Download",
      cell: (row) => (
        <button
          onClick={() => generatePdf(row)}
          className="flex items-center justify-center text-gray-500 hover:text-gray-700"
        >
          <AiOutlineDownload className="h-5 w-5" />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={payments}
      pagination
      highlightOnHover
    />
  )
}

export default AdminPaymentsTable;