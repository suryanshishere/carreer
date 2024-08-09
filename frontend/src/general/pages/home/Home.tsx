import React, { useEffect, useState } from "react";
import { IPostList } from "models/post/IPostList";
import HomeListItem from "general/components/shared/item/HomeList";
import { useHttpClient } from "shared/hooks/http-hook";
import { useDispatch } from "react-redux";
import { dataStatusUIAction } from "shared/store/dataStatus-ui-slice";
import { formatWord } from "shared/components/uiElements/uihelpers/format-word";
import { useAdminExamData } from "db/admin/AdminExamData";
import "./Home.css";
import useUserData from "shared/localStorageConfig/use-userData-hook";

const Home: React.FC = () => {
  const { category } = useAdminExamData();
  
  const { sendRequest, error } = useHttpClient();
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
          `${process.env.REACT_APP_BASE_URL}/home`,
          "GET",
          null,
          { userid: userId || "" }
        );
        const responseData: IPostList = response.data as unknown as IPostList;
        setData(responseData);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  return (
    <div className="grid grid-cols-3 gap-3">
      {Object.keys(data).map((key) => (
        <HomeListItem
          key={key}
          ListItemData={data[key] || []}
          category={key}
          categoryTitle={formatWord(key)}
          height={
            key === "result" || 
            key === "admit_card" || 
            key === "latest_job"
              ? "55rem"
              : "30rem"
          }
        />
      ))}
    </div>
  );
};

export default Home;
