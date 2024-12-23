import { IPostAdminData } from "models/admin/IPostAdminData";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useHttpClient } from "shared/hooks/http-hook";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";

const EditPostComponent = () => {
  const { post_section } = useParams();
  const { sendRequest, error } = useHttpClient();
  const [data, setData] = useState<IPostAdminData[]>([]);
  const navigate = useNavigate();
  // const { userId, token } = useSelector(
  //   (state: RootState) => state.auth.userData
  // );

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await sendRequest(
  //         `${process.env.REACT_APP_BASE_URL}/admin/private/${post_section}/all_post_admin_data`,
  //         "GET",
  //         null,
  //         {
  //           
  //           Authorisation: "Bearer " + token,
  //         }
  //       );

  //       const responseData = response.data as unknown as {
  //         [key: string]: IPostAdminData[];
  //       };
  //       const firstKey = Object.keys(responseData)[0];
  //       const responseDataValue = responseData[firstKey] || [];

  //       if (responseDataValue.length > 0) {
  //         setData(responseDataValue);
  //       } else {
  //         navigate(-1);
  //       }
  //     } catch (err) {}
  //   };

  //   fetchData();
  // }, [post_section]);

  return (
    <ul>
      {/* {data.map((item) => (
        <li key={item._id}>
          {item.name_of_the_post}{" "}
          <Link to={`${item._id}`}>
            <EditIcon />
          </Link>{" "}
        </li>
      ))} */}
    </ul>
  );
};

export default EditPostComponent;
