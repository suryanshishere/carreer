import React from "react";
import Filter from "shared/utilComponents/utilPost/Filter";
import { useCategoryPostListData } from "db/postDb/post-db-hook";
import "./Category.css";
import List from "shared/uiComponents/List";

const Category: React.FC = () => {
  const data = useCategoryPostListData();
  // const { nPages, currentPage, setCurrentPage, currentRecords } =
  //   usePagination(categoryListData);

  return (
    <div className="flex gap-3">
      {Object.keys(data).map((key) => (
        <List key={key} currentRecords={data[key]} category={key} />
      ))}
      <Filter data={data.length} />
    </div>
  );
};

export default Category;
