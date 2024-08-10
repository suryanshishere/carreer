import React, { useState } from "react";
import { IPostListData } from "models/post/IPostList";
import Pagination from "shared/components/utils/Pagination";
import { usePagination } from "shared/hooks/pagination-hook";
import List from "shared/components/uiElements/List";
import "./CategoryList.css";

interface CategoryItemProps {
  categoryListData: IPostListData[];
  category: string;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  categoryListData,
  category,
}) => {
  const { nPages, currentPage, setCurrentPage, currentRecords } =
    usePagination(categoryListData);


  return (
    <div className="w-full flex flex-col gap-4">
      <List currentRecords={categoryListData} category={category} />
      {/* <Pagination
        nPages={nPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      /> */}
    </div>
  );
};

export default CategoryItem;
