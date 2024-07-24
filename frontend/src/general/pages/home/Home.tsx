import React, { useEffect, useState } from "react";
import { IList } from "models/exam/IList";
import HomeListItem from "general/components/shared/item/HomeList";
import { useHttpClient } from "shared/hooks/http-hook";
import { useDispatch } from "react-redux";
import { dataStatusUIAction } from "shared/store/dataStatus-ui-slice";
import { formatWord } from "shared/helpers/format-word";
import { useAdminExamData } from "db/admin/AdminExamData";
import "./Home.css";
import useUserData from "shared/localStorageConfig/userData-hook";

const Home: React.FC = () => {
  const { category } = useAdminExamData();

  const { sendRequest, error, isLoading } = useHttpClient();
  const [loadedExam, setLoadedExam] = useState<IList[]>([]);
  const { token, userId } = useUserData();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(dataStatusUIAction.setErrorHandler(error));
    dispatch(dataStatusUIAction.isLoadingHandler(isLoading));
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
        const responseData: IList[] = response.data as unknown as IList[];
        setLoadedExam(responseData);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  // Define an object to map categories to their respective filtered data and titles
  const filteredData: {
    [key: string]: { data: IList[] };
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
