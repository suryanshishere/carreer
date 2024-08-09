import React from "react";
import { PostData } from "models/post/IPostList";
import Pagination from "shared/components/utils/Pagination";
import { usePagination } from "shared/hooks/pagination-hook";
import List from "shared/components/uiElements/List";
import "./Category.css";

interface CategoryItemProps {
  CategoryListData: PostData[];
}

const CategoryItem: React.FC<CategoryItemProps> = ({ CategoryListData }) => {
  const { nPages, currentPage, setCurrentPage, currentRecords } =
    usePagination(CategoryListData);

  return (
    <div className="w-full flex flex-col gap-4">
      <List currentRecords={currentRecords} />
      <Pagination
        nPages={nPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default CategoryItem;
