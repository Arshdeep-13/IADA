import React, { useEffect, useState } from "react";

const Pagination = ({
  dataArr,
  controlledUnregisteredIndustries,
  setcontrolledUnregisteredIndustries,
}) => {
  const [activeBtn, setActiveBtn] = useState(1);
  const [NumberOfPages, setNumberOfPages] = useState(1);

  const updatePaginationData = () => {
    if (dataArr.length <= 0) {
      setNumberOfPages(1);
      return;
    }
    if (dataArr.length >= 15) {
      setNumberOfPages(Math.ceil(dataArr.length / 15));
      setcontrolledUnregisteredIndustries(dataArr.slice(0, 15));
    }
  };

  const updatePageData = (activePage) => {
    const startIndex = (activePage - 1) * 15;
    const endIndex = activePage * 15;

    if (startIndex >= 0 && endIndex <= dataArr.length) {
      setcontrolledUnregisteredIndustries(dataArr.slice(startIndex, endIndex));
    } else {
      setcontrolledUnregisteredIndustries(dataArr);
    }
  };

  useEffect(() => {
    updatePaginationData();
  }, [dataArr]);

  useEffect(() => {
    updatePageData(activeBtn);
  }, [dataArr, activeBtn]);

  // Handle button clicks
  const handlePrevious = () => {
    if (activeBtn - 1 > 0) {
      setActiveBtn(activeBtn - 1);
    } else {
      setActiveBtn(NumberOfPages);
    }
  };

  const handleNext = () => {
    if (activeBtn + 1 <= NumberOfPages) {
      setActiveBtn(activeBtn + 1);
    } else {
      setActiveBtn(1);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      <button
        onClick={handlePrevious}
        className="px-4 py-2 font-semibold bg-gray-200 text-blue-800 hover:bg-blue-300 rounded-md"
      >
        Previous
      </button>
      {Array.from({ length: NumberOfPages }, (_, i) => (
        <button
          key={i}
          onClick={() => setActiveBtn(i + 1)}
          className={`px-4 py-2 font-semibold bg-gray-200 text-blue-800 hover:bg-blue-300 rounded-md ${
            activeBtn === i + 1 ? "bg-blue-300" : ""
          }`}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={handleNext}
        className="px-4 py-2 font-semibold bg-gray-200 text-blue-800 hover:bg-blue-300 rounded-md"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
