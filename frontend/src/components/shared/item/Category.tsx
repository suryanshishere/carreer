import React from "react";
import { ExamListItem } from "../../../models/exam/ListProps";
import Pagination from "src/shared/components/utils/Pagination";
import { usePagination } from "src/shared/hooks/pagination";
import List from "src/shared/components/uiElements/List";
import "./Category.css";

interface CategoryItemProps {
  CategoryListData: ExamListItem[];
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
