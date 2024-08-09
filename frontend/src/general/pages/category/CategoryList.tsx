import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {  PostData } from "models/post/IPostList";
import CategoryItem from "general/components/shared/item/Category";
import { useHttpClient } from "shared/hooks/http-hook";
import Filter from "shared/components/utils/Filter";
import { useDispatch } from "react-redux";
import { dataStatusUIAction } from "shared/store/dataStatus-ui-slice";
import useUserData from "shared/localStorageConfig/use-userData-hook";
import "./CategoryList.css";

const CategoryList: React.FC = () => {
  const { category = "" } = useParams();
  const { error, sendRequest } = useHttpClient();
  const [loadedExam, setLoadedExam] = useState<PostData[]>([]);
  const { token, userId } = useUserData();
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(dataStatusUIAction.setErrorHandler(error));
  }, [error,  dispatch]);

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
        const responseData = response.data as unknown as PostData[];
        setLoadedExam(responseData);
      } catch (err) {}
    };

    fetchPlaces();
  }, [sendRequest, category, userId]);

  return (
    <div className="flex gap-3">
      <CategoryItem CategoryListData={loadedExam} />
      <Filter data={loadedExam.length} />
    </div>
  );
};

export default CategoryList;
