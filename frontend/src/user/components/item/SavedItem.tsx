import React, { useState, useEffect } from "react";
import { IPostList } from "models/postModels/IPostList";
import List from "post/components/List";
import Pagination from "shared/utils/postUtils/Pagination";
import usePagination from "shared/hooks/pagination-hook";
import "./SavedItem.css";

interface SavedProps {
  savedExamData: IPostList;
}

const SavedItem: React.FC<SavedProps> = ({ savedExamData }) => {
  const [filteredData, setFilteredData] = useState<IPostList>([]);

  useEffect(() => {
    // Set filteredData initially
    setFilteredData(savedExamData);
  }, [savedExamData]);

  // Pagination logic
  const { nPages, currentPage, setCurrentPage, currentRecords } =
    usePagination(filteredData);

  // Handler to delete an item by id
  // const savedDeleteHandler = (id: string | number) => {
  //   const updatedData = filteredData.filter((item) => item._id !== id);
  //   setFilteredData(updatedData);
  // };

  return (
    <div className="w-full flex flex-col gap-4">
      {filteredData.length === 0 ? (
        <p className="h-full">
          No saved exam. Try finding your interested exams and add it here by
          clicking on the bookmark icon.
        </p>
      ) : (
        <>
          <List
            data={currentRecords}
            section={""}
            // onSavedDelete={savedDeleteHandler}
          />
          {filteredData.length !== 0 && (
            <Pagination
              nPages={nPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SavedItem;
