import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { FiDownload, FiTrash } from "react-icons/fi";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const Admindocumenttable = ({ bills, onDelete }) => {
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelect = (row) => {
    if (selectedRows.includes(row._id)) {
      setSelectedRows(selectedRows.filter((id) => id !== row._id));
    } else {
      setSelectedRows([...selectedRows, row._id]);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER}/api/zAdmin/deleteDocuments`,
        {
          ids: selectedRows,
        }
      );
      onDelete(selectedRows);
      setSelectedRows([]);
      toast.success("Documents deleted successfully", {
        position: "top-left",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error deleting documents:", error);
      toast.error("Error deleting documents", {
        position: "top-left",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const showPdf = (fileData, contentType) => {
    const byteArray = new Uint8Array(fileData.data);
    const blob = new Blob([byteArray], { type: contentType });
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  const columns = [
    {
      name: "Select",
      cell: (row) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(row._id)}
          onChange={() => handleSelect(row)}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Date",
      selector: (bills) => new Date(bills.uploadDate).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Industry Name",
      selector: (row) => row.industry.industry_name,
      sortable: true,
    },
    {
      name: "Industry User Name",
      selector: (row) => row.industry.name,
      sortable: true,
    },
    {
      name: "Document",
      selector: (row) => row.docname,
      sortable: true,
      cell: (row) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>{row.docname}</span>
            <a
              onClick={() => showPdf(row.documentUrl, row.documentType)}
              target="_blank"
              download
              style={{ marginLeft: "10px" }}
            >
              <button
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                <FiDownload size={20} />
              </button>
            </a>
          </div>
        );
      },
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
      <ToastContainer
        position="top-left"
        autoClose={1098}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="mt-4">
        {selectedRows.length > 0 && (
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white p-2 rounded-lg mb-4 flex items-center"
          >
            <FiTrash size={20} className="mr-2" />
            Delete Selected
          </button>
        )}
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

export default Admindocumenttable;
