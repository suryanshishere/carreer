import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHttpClient } from "shared/utilComponents/hooks/http-hook";
import { dataStatusUIAction } from "shared/utilComponents/store/dataStatus-ui-slice";
import { IPostDetail } from "models/post/IPostDetail";
import { useParams } from "react-router-dom";

export const useDetailPostData = () => {
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

  return data;
};
