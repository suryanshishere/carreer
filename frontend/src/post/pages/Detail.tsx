import React from "react";
import DetailItem from "post/components/DetailItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useDetailPostData } from "db/postDb/detail-post-data";
import "./Detail.css";
// import Bookmark from "src/shared/components/utils/Bookmark";
// import DETAIL_PAGE from "src/db/exams/Details.json"

const Detail: React.FC = () => {
  const data = useDetailPostData();

  return (
    <div className="detail_page_sec flex flex-col items-center">
      <div className="detail_author font-bold w-full flex items-center">
        <div className="w-full">
          <hr />
        </div>
        {
          <div className="min-w-fit ml-2 flex items-center gap-1">
            <span className="mb-1">careergram</span>
            <FontAwesomeIcon
              style={{ color: "var(--color-green)" }}
              icon={faCircleCheck}
            />
            {/* <Bookmark itemId={examId} /> */}
          </div>
        }
      </div>
      <h3>postId</h3>
      {data && <DetailItem detailPageData={data} />}
    </div>
  );
};

export default Detail;
