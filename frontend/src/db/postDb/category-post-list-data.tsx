import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHttpClient } from "shared/utilComponents/hooks/http-hook";
import { dataStatusUIAction } from "shared/utilComponents/store/data-status-ui";
import useUserData from "shared/utilComponents/localStorageConfig/use-userData-hook";
import { IPostList } from "models/post/IPostList";
import { useParams } from "react-router-dom";

export const useCategoryPostListData = () => {
  const { category = "" } = useParams(); 
  const { error, sendRequest } = useHttpClient();
  const [data, setData] = useState<IPostList>({});
  const { token, userId } = useUserData();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(dataStatusUIAction.setErrorHandler(error));
  }, [error, dispatch]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BASE_URL}/category/${category}`,
          "GET",
          null,
          {
            userid: userId || "",
          }
        );
        const responseData = response.data as unknown as IPostList;
        setData(responseData);
      } catch (err) {}
    };

    fetchPlaces();
  }, [sendRequest, category, userId]);

  return data;
};
