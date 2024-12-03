import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useHttpClient } from "shared/hooks/http-hook";

import { IPostDetail } from "models/postModels/IPostDetail";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";

//TODO: from the response take the undefined field to display
const AdminComponent: React.FC = () => {
  const { post_section } = useParams();
  const [data, setData] = useState<IPostDetail[]>([]);
  const { sendRequest, error } = useHttpClient();
  //   const {userId, token } = useSelector(
  //   (state: RootState) => state.auth.userData
  // );
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await sendRequest(
  //         `${process.env.REACT_APP_BASE_URL}/admin/private/contributed_post_data`,
  //         "POST",
  //         JSON.stringify({ post_section }),
  //         {
  //           "Content-Type": "application/json",
  //           Authorization: "Bearer " + token,
  //           
  //         }
  //       );

  //       const responseData = response.data as unknown as {
  //         [key: string]: IPostDetail[];
  //       };
  //       const firstKey = Object.keys(responseData)[0];
  //       const responseDataValue = responseData[firstKey];

  //       if(responseDataValue.length > 0) {
  //         setData(responseDataValue);
  //       }else{
  //         navigate(-1)
  //       }
  //     } catch (err) {
  //     }
  //   };

  //   fetchData();
  // }, [post_section, token, userId, sendRequest]);

  // const approvedHandler = async (postId: string | undefined) => {

  //   if (postId === undefined) return;
  //   try {
  //     await sendRequest(
  //       `${process.env.REACT_APP_BASE_URL}/admin/private/approve_post`,
  //       "POST",
  //       JSON.stringify({ post_section, postId }),
  //       {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + token,
  //         
  //       }
  //     );

  //     // Filter out the approved item
  //     setData((prevData) => prevData.filter((item) => item._id !== postId));
  //   } catch (err) {
  //     console.error(err); // Log error to console
  //   }
  // };

  return (
    <ul>
      {data.map((item) => (
        <li key={item._id}>
          {item._id}: {item.name_of_the_post}
          <button >Approved</button>
        </li>
      ))}
    </ul>
  );
};

export default AdminComponent;
