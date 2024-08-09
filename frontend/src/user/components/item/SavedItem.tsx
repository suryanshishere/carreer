import React, { useState, useEffect } from "react";
import { PostData } from "models/post/IPostList";
import List from "shared/components/uiElements/List";
import Pagination from "shared/components/utils/Pagination";
import { usePagination } from "shared/hooks/pagination-hook";
import Para from "shared/components/uiElements/cover/Para";
import "./SavedItem.css";

interface SavedProps {
  savedExamData: PostData[];
}

const SavedItem: React.FC<SavedProps> = ({ savedExamData }) => {
  const [filteredData, setFilteredData] = useState<PostData[]>([]);

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
        <Para className="h-full">
          No saved exam. Try finding your interested exams and add it here by
          clicking on the bookmark icon.
        </Para>
      ) : (
        <>
          <List
            currentRecords={currentRecords}
            showBookmark={false}
            showCategory={true}
            showDelete={true}
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
