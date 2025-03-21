import React from "react";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

interface PaginationProps {
  onLoadMore: () => void;
  isLoading: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ onLoadMore, isLoading }) => {
  return (
    <div className="flex justify-center mobile:justify-end mt-4">
      <button
        onClick={onLoadMore}
        className="custom_link flex items-center"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Load More"} <ArrowDownwardIcon />
      </button>
    </div>
  );
};

export default Pagination;
