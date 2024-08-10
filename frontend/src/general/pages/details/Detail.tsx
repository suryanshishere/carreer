import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DetailItem from "general/components/shared/item/Detail";
import { useHttpClient } from "shared/hooks/http-hook";
import { useDispatch } from "react-redux";
import { dataStatusUIAction } from "shared/store/dataStatus-ui-slice";
import NotFound from "shared/pages/NotFound";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import "./Detail.css";
import { formatWord } from "shared/components/uiElements/uihelpers/format-word";
import { IPostDetail } from "models/post/IPostDetail";
// import Bookmark from "src/shared/components/utils/Bookmark";
// import DETAIL_PAGE from "src/db/exams/Details.json"

const Detail = () => {
  const { postId = "", category = "" } = useParams<{
    postId: string;
    category: string;
  }>();

  const { error, sendRequest } = useHttpClient();
  const [data, setData] = useState<IPostDetail>({});

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(dataStatusUIAction.setErrorHandler(error));
  }, [error, dispatch]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BASE_URL}/category/${category}/${postId}`
        );
        const responseData = response.data as unknown as IPostDetail;
        setData(responseData);
      } catch (err) {}
    };

    fetchPlaces();
  }, [sendRequest, category, postId]);

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
      {data && (
        <DetailItem detailPageData={data} />
      )}
    </div>
  );
};

export default Detail;
