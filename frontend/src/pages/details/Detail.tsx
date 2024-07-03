import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DetailPage } from "src/models/exam/DetailProps";
import DetailItem from "src/components/shared/item/Detail";
import { useHttpClient } from "src/shared/hooks/http";
import { useDispatch } from "react-redux";
import { responseUIAction } from "src/shared/store/reponse-ui-slice";
import NotFound from "src/rootLayout/NotFound";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import "./Detail.css";
import Bookmark from "src/shared/components/utils/Bookmark";
// {
//     _id: "",
//     related_detail_page: [],
//     author: "",
//   }
const Detail = () => {
  const { examId = "", category = "" } = useParams<{
    examId: string;
    category: string;
  }>();

  const { error, isLoading, sendRequest } = useHttpClient();
  const [loadedExamDetail, setLoadedExamDetail] = useState<DetailPage>({
    author: "",
    related_detail_page: [],
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(responseUIAction.isLoadingHandler(isLoading));
  }, [error, isLoading, dispatch]);

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

  if (loadedExamDetail.related_detail_page.length === 0 && !isLoading) {
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
        {loadedExamDetail.author || (
          <div className="min-w-fit ml-2 flex items-center gap-1">
            <span className="mb-1">careergram</span>
            <FontAwesomeIcon
              style={{ color: "var(--color-green)" }}
              icon={faCircleCheck}
            />
            <Bookmark itemId={examId}/>
          </div>
        )}
      </div>
      <DetailItem relatedDetailPage={loadedExamDetail.related_detail_page} />
    </div>
  );
};

export default Detail;
