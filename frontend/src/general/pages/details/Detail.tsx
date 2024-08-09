import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DetailPage } from "models/post/IDetail";
import DetailItem from "general/components/shared/item/Detail";
import { useHttpClient } from "shared/hooks/http-hook";
import { useDispatch } from "react-redux";
import { dataStatusUIAction } from "shared/store/dataStatus-ui-slice";
import NotFound from "shared/pages/NotFound";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import "./Detail.css";
import { formatWord } from "shared/components/uiElements/uihelpers/format-word";
// import Bookmark from "src/shared/components/utils/Bookmark";
// import DETAIL_PAGE from "src/db/exams/Details.json"

const Detail = () => {
  const { examId = "", category = "" } = useParams<{
    examId: string;
    category: string;
  }>();

  const { error,  sendRequest } = useHttpClient();
  const [loadedExamDetail, setLoadedExamDetail] = useState<DetailPage>();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(dataStatusUIAction.setErrorHandler(error));
  }, [error,  dispatch]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BASE_URL}/category/${category}/${examId}`
        );
        const responseData: DetailPage = response.data as unknown as DetailPage;
        setLoadedExamDetail(responseData);
      } catch (err) {}
    };

    fetchPlaces();
  }, [sendRequest, category, examId]);

  if (!loadedExamDetail) {
    return (
      <NotFound>
        No exam detail found, might be updating. Try again later!
      </NotFound>
    );
  }

  return (
    <div className="detail_page_sec flex flex-col items-center">
      <div className="detail_author font-bold w-full flex items-center">
        <div className="w-full">
          <hr />
        </div>
        {loadedExamDetail?.created_by || (
          <div className="min-w-fit ml-2 flex items-center gap-1">
            <span className="mb-1">careergram</span>
            <FontAwesomeIcon
              style={{ color: "var(--color-green)" }}
              icon={faCircleCheck}
            />
            {/* <Bookmark itemId={examId} /> */}
          </div>
        )}
      </div>
      <h3>{formatWord(examId)}</h3>
      {loadedExamDetail && (
        <DetailItem relatedDetailPage={loadedExamDetail.related_detail_page} />
      )}
    </div>
  );
};

export default Detail;
