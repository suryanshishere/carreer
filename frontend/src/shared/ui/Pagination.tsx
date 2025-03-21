import React from "react";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";

interface PaginationProps {
  onLoadMore: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  onLoadMore,
  isLoading,
  disabled = false,
}) => {
  return (
    <div className="flex justify-center mobile:justify-end mt-4">
      <button
        onClick={onLoadMore}
        className="custom_link flex items-center"
        disabled={isLoading || disabled}
      >
        {isLoading ? "Loading..." : "Load More"}
        <KeyboardDoubleArrowDownIcon className="mt-1" />
      </button>
    </div>
  );
};

export default Pagination;
