import { ICommonListData } from "posts/db/interfaces";
import { useEffect, useState } from "react";

const usePagination = (data: ICommonListData[]) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(
    parseInt(process.env.REACT_APP_RECORDS_PER_PAGE ?? "10", 10)
  );
  const [dataChanged, setDataChanged] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
    setDataChanged(false);
  }, [data]);

  // Ensure data is an array and calculate nPages
  const validData = Array.isArray(data) ? data : [];
  const nPages = Math.max(Math.ceil(validData.length / recordsPerPage), 1);

  // Ensure the currentPage is within the valid range
  const safeCurrentPage = Math.min(currentPage, nPages);

  // Calculate the indices for slicing the data
  const indexOfLastRecord = Math.min(
    safeCurrentPage * recordsPerPage,
    validData.length
  );
  const indexOfFirstRecord = Math.max(indexOfLastRecord - recordsPerPage, 0);
  const currentRecords = validData.slice(indexOfFirstRecord, indexOfLastRecord);

  return {
    nPages,
    currentPage: safeCurrentPage,
    setCurrentPage,
    currentRecords,
    dataChanged,
    setDataChanged,
  };
};

export default usePagination;
