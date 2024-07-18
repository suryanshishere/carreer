import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IList } from "models/exam/IList";
import CategoryItem from "general/components/shared/item/Category";
import { useHttpClient } from "shared/hooks/http-hook";
import Filter from "shared/components/utils/Filter";
import { useDispatch } from "react-redux";
import { responseUIAction } from "shared/store/reponse-ui-slice";
import NotFound from "shared/pages/NotFound";
import "./CategoryList.css";
import { getUserData } from "shared/localStorageConfig/auth-local-storage";

const CategoryList: React.FC = () => {
  const { category = "" } = useParams();
  const { error, sendRequest, isLoading } = useHttpClient();
  const [loadedExam, setLoadedExam] = useState<IList[]>([]);
  const userData = getUserData();
  const { userId } = userData;  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(responseUIAction.isLoadingHandler(isLoading));
    dispatch(responseUIAction.setErrorHandler(error));
  }, [error, isLoading, dispatch]);

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
        const responseData: IList[] =
          response.data as unknown as IList[];
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