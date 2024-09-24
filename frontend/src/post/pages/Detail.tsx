import React from "react";
import DetailItem from "post/components/DetailItem";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useDetailPostData } from "db/postDb/post-db-hook";
import DetailItemHeader from "post/components/DetailItemHeader";
import "./Detail.css";
// import Bookmark from "src/shared/components/utils/Bookmark";
// import DETAIL_PAGE from "src/db/exams/Details.json"

const Detail: React.FC = () => {
  const data = useDetailPostData();

  return (
    <div className="detail_page_sec flex flex-col items-center">
      <DetailItemHeader/>
      <h3>postId</h3>
      {data && <DetailItem detailPageData={data} />}
    </div>
  );
};

export default Detail;
