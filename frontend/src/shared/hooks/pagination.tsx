import { ExamListItem } from "src/models/exam/ListProps";
import { useEffect, useState } from "react";

export const usePagination = (data: ExamListItem[]) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(parseInt(process.env.REACT_APP_RECORDS_PER_PAGE ?? '10', 10));
  const [dataChanged, setDataChanged] = useState(false); // Track data changes

  useEffect(() => {
    setCurrentPage(1);
    setDataChanged(false);
  }, [data]);

  // Calculate nPages, defaulting to 1 if no data is available
  const nPages = Math.max(Math.ceil(data.length / recordsPerPage), 1);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = data.slice(indexOfFirstRecord, indexOfLastRecord);

  return {
    nPages,
    currentPage,
    setCurrentPage,
    currentRecords,
    dataChanged,
    setDataChanged,
  };
};
