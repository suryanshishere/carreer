import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ExamListItem } from "src/models/exam/ListProps";
import CategoryItem from "src/components/shared/item/Category";
import { useHttpClient } from "src/shared/hooks/http";
import Filter from "src/shared/components/utils/Filter";
import { useAuth } from "src/shared/hooks/auth";
import { useDispatch } from "react-redux";
import { responseUIAction } from "src/shared/store/reponse-ui-slice";
import NotFound from "src/rootLayout/NotFound";
import "./CategoryList.css";

const CategoryList: React.FC = () => {
  const { category = "" } = useParams();
  const { error, sendRequest, isLoading } = useHttpClient();
  const [loadedExam, setLoadedExam] = useState<ExamListItem[]>([]);
  const { userId } = useAuth();
  const dispatch = useDispatch();

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
        const responseData: ExamListItem[] =
          response.data as unknown as ExamListItem[];
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
