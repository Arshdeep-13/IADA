import React from "react";
import DataTable from "react-data-table-component";

const ZoneWaterBillTable = ({ bills }) => {
  // console.log(bills[0]?.isDue);
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
      name: "Consumer no",
      selector: (bills) => bills.consumerNo,
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
      name: "Current Total",
      selector: (bills) => bills.currentTotal,
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
    {
      name: "Amount After Due Date",
      selector: (bills) => bills.amountPayAfterDueDate,
      sortable: true,
    },
    {
      name: "Industry Name",
      selector: (bills) =>
        bills.industryInfo ? bills.industryInfo.industry_name : "N/A",
      sortable: true,
    },
    {
      name: "GST IN",
      selector: (bills) =>
        bills.industryInfo ? bills.industryInfo.gstin_number : "N/A",
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
        backgroundColor: "#bfdbfe", // Tailwind's blue-200
        fontFamily: "Sans-serif",
        fontSize: "18px",
        fontWeight: "600",
        color: "#1e3a8a", // Tailwind's blue-900
        borderBottom: "2px solid #93c5fd", // Tailwind's blue-300
      },
    },
    headCells: {
      style: {
        fontSize: "16px",
        fontFamily: "Sans-serif",
        fontWeight: "600",
        color: "#1e3a8a", // Tailwind's blue-900
        padding: "12px",
      },
    },
    rows: {
      style: {
        fontFamily: "Baloo Bhai 2, cursive",
        fontSize: "18px",
        color: "#1e3a8a", // Tailwind's blue-900
        borderBottom: "1px solid #bfdbfe", // Tailwind's blue-200
        padding: "12px",
        "&:hover": {
          backgroundColor: "#e0f2fe", // Tailwind's blue-100
          cursor: "pointer",
        },
      },
    },
    pagination: {
      style: {
        fontFamily: "Sans-serif",
        fontSize: "16px",
        fontWeight: "500",
        color: "#1e40af", // Tailwind's blue-800
        padding: "10px",
        backgroundColor: "#eff6ff", // Tailwind's blue-50
        borderTop: "1px solid #93c5fd", // Tailwind's blue-300
      },
    },
  };

  return (
    <>
      <div className="mt-14">
        <DataTable
          customStyles={customStyles}
          className="dataTables_wrapper"
          columns={columns}
          data={bills}
          fixedHeader
          pagination
          responsive
          highlightOnHover
          pointerOnHover
        />
      </div>
    </>
  );
};

export default ZoneWaterBillTable;
