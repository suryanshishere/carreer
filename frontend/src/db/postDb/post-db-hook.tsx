import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHttpClient } from "shared/utilComponents/hooks/http-hook";
import { dataStatusUIAction } from "shared/utilComponents/store/data-status-ui";
import useUserData from "shared/utilComponents/hooks/user-data-hook";
import { IPostList } from "models/post/IPostList";
import NAV from "db/nav/Nav.json";
import { convertToSnakeCase } from "shared/utilComponents/quick/case-convert";
import { useParams } from "react-router-dom";
import { IPostDetail } from "models/post/IPostDetail";

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
          //TODO: vulnerability of unknown person able to know the other people bookmark just by using the userId header, 
          //rather we also send the token or related
          //it's used for bookmark and related configuring (do it for the other below hook as well)
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
        );
        const responseData = response.data as unknown as IPostList;
        setData(responseData);
      } catch (err) {}
    };

    fetchPlaces();
  }, [sendRequest, category, userId]);

  return data;
};