import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { IconButton } from "@mui/material";
import "./Pagination.css";

interface PaginationProps {
  currentPage: number;
  nPages: number;
  setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  nPages,
  setCurrentPage,
}) => {
  const goToNextPage = () => {
    if (currentPage !== nPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1);
  };

  if(!nPages || nPages === 1){
    return null;
  }

  return (
    <ul className="pagination_ul">
      <section className="page_no_sec">Page No. {currentPage}</section>
      <section>
        <IconButton
          onClick={goToPrevPage}
          disabled={currentPage === 1}
        >
          <ArrowBackIcon />
        </IconButton>
        <IconButton
          onClick={goToNextPage}
          disabled={currentPage === nPages}
        >
          <ArrowForwardIcon />
        </IconButton>
      </section>
    </ul>
  );
};

export default Pagination;
