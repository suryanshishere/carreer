import React, { useEffect, useState } from "react";
import { ExamListItem } from "models/exam/ListProps";
import HomeListItem from "general/components/shared/item/HomeList";
import { useHttpClient } from "shared/hooks/http-hook";
import  useAuth  from "shared/hooks/auth-hook";
import { useDispatch } from "react-redux";
import { responseUIAction } from "shared/store/reponse-ui-slice";
import { formatWord } from "shared/utils/FormatWord";
import { useAdminExamData } from "db/admin/AdminExamData";
import "./Home.css";

const Home: React.FC = () => {
  const { category } = useAdminExamData();

  const { sendRequest, error, isLoading } = useHttpClient();
  const [loadedExam, setLoadedExam] = useState<ExamListItem[]>([]);
  const { userId } = useAuth();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(responseUIAction.setErrorHandler(error));
    dispatch(responseUIAction.isLoadingHandler(isLoading));
  }, [error, isLoading, dispatch]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BASE_URL}/home`,
          "GET",
          null,
          { userid: userId || "" }
        );
        const responseData: ExamListItem[] =
          response.data as unknown as ExamListItem[];
        setLoadedExam(responseData);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, userId]);


  // Define an object to map categories to their respective filtered data and titles
  const filteredData: {
    [key: string]: { data: ExamListItem[] };
  } = {};

  category.forEach((item) => {
    filteredData[item.code] = {
      data: loadedExam.filter((subItem) => subItem.category === item.code),
    };
  });

  return (
    <div className="grid grid-cols-3 gap-3">
      {category.map((category) => (
        <HomeListItem
          key={category.code}
          ListItemData={filteredData[category.code]?.data || []}
          category={category.code}
          categoryTitle={formatWord(category.code)}
          height={
            category.code === "results" ||
            category.code === "admit_cards" ||
            category.code === "latest_jobs"
              ? "55rem"
              : "30rem"
          }
        />
      ))}
    </div>
  );
};

export default Home;
