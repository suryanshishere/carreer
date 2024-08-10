import React, { useEffect, useState } from "react";
import { IPostList, IPostListData } from "models/post/IPostList";
import HomeListItem from "general/components/shared/item/HomeList";
import { useHttpClient } from "shared/hooks/http-hook";
import { useDispatch } from "react-redux";
import { dataStatusUIAction } from "shared/store/dataStatus-ui-slice";
import { useAdminExamData } from "db/admin/AdminExamData";
import useUserData from "shared/localStorageConfig/use-userData-hook";
import NAV from "db/nav/Nav.json";
import "./Home.css";
import { camelToSnake } from "shared/helpers/case-convert";

const Home: React.FC = () => {
  const { category } = useAdminExamData();
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
        console.log(responseData)
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

      const snakeCaseKey = camelToSnake(key);
      if (NAV.includes(snakeCaseKey)) {
        filteredData[snakeCaseKey] = data[key];
      }
    });
  
    console.log(filteredData);
    return filteredData;
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {Object.keys(data).map((key) => (
        <HomeListItem
          key={key}
          ListItemData={data[key] || []} // Use filteredData instead of data
          category={key}
          height={
            key === "result" || key === "admit_card" || key === "latest_job"
              ? "55rem"
              : "30rem"
          }
        />
      ))}
    </div>
  );
};

export default Home;
