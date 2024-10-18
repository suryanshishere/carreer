import React from "react";

const DetailItemHeader = () => {
  return (
    <div className="detail_author font-bold w-full flex items-center">
      <div className="w-full">
        <hr />
      </div>
      {
        <div className="min-w-fit ml-2 flex items-center gap-1">
          <span className="mb-1">careergram</span>
          {/* <FontAwesomeIcon
            style={{ color: "var(--color-green)" }}
            icon={faCircleCheck}
          /> */}
          {/* <Bookmark itemId={examId} /> */}
        </div>
      }
    </div>
  );
};

export default DetailItemHeader;
