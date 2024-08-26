import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHttpClient } from "shared/utilComponents/hooks/http-hook";
import { dataStatusUIAction } from "shared/utilComponents/store/dataStatus-ui-slice";
import useUserData from "shared/utilComponents/localStorageConfig/use-userData-hook";
import { IPostList } from "models/post/IPostList";
import NAV from "db/nav/Nav.json";
import { convertToSnakeCase } from "shared/utilComponents/quick/case-convert";

export const useHomePostListData = () => {
  const { sendRequest, error } = useHttpClient();
  const [data, setData] = useState<IPostList>({});

  const { token, userId } = useUserData();
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      dispatch(dataStatusUIAction.setErrorHandler(error));
    }
  }, [error, dispatch]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BASE_URL}/home`,
          "GET",
          null,
          { userid: userId || "" }
        );
        const responseData = response.data as unknown as IPostList;
        setData(filterDataByAllowedKeys(responseData));
      } catch (err) {
        dispatch(dataStatusUIAction.setErrorHandler("Failed to fetch posts"));
      }
    };
    fetchPosts();
  }, [sendRequest, userId, dispatch]);

  // Extra filter for protecting from unwanted data
  const filterDataByAllowedKeys = (data: IPostList) => {
    const filteredData: IPostList = {};

    Object.keys(data).forEach((key) => {
      const snakeCaseKey = convertToSnakeCase(key);
      if (NAV.includes(snakeCaseKey)) {
        filteredData[snakeCaseKey] = data[key];
      }
    });

    return filteredData;
  };

  return data;
};
