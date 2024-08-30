import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "shared/utilComponents/hooks/http-hook";
import useUserData from "shared/utilComponents/localStorageConfig/use-userData-hook";
import { IPostDetail } from "models/post/IPostDetail";

const AdminComponent: React.FC = () => {
  const { post_section } = useParams();
  const [data, setData] = useState<IPostDetail[]>([]);
  const { sendRequest, error } = useHttpClient();
  const { userId, token } = useUserData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BASE_URL}/admin/private/contributed_post_data`,
          "POST",
          JSON.stringify({ post_section }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
            userid: userId || "",
          }
        );

        const responseData = response.data as unknown as {
          [key: string]: IPostDetail[];
        };
        const firstKey = Object.keys(responseData)[0];
        const responseDataValue = responseData[firstKey];

        setData(responseDataValue);
      } catch (err) {
      }
    };

    fetchData();
  }, [post_section, token, userId, sendRequest]);

  const approvedHandler = async (postId: string | undefined) => {
    
    if (postId === undefined) return;
    try {
      await sendRequest(
        `${process.env.REACT_APP_BASE_URL}/admin/private/approve_post`,
        "POST",
        JSON.stringify({ post_section, postId }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
          userid: userId || "",
        }
      );

      // Filter out the approved item
      setData((prevData) => prevData.filter((item) => item._id !== postId));
    } catch (err) {
      console.error(err); // Log error to console
    }
  };

  return (
    <ul>
      {data.map((item) => (
        <li key={item._id}>
          {item._id}: {item.name_of_the_post}
          <button onClick={() => approvedHandler(item._id)}>Approved</button>
        </li>
      ))}
    </ul>
  );
};

export default AdminComponent;
