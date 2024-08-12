import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { IPostAdminData } from "models/admin/IPostAdminData";
import { useHttpClient } from "shared/utilComponents/hooks/http-hook";
import { dataStatusUIAction } from "shared/utilComponents/store/dataStatus-ui-slice";
import useUserData from "shared/utilComponents/localStorageConfig/use-userData-hook";

export const usePostAdminData = () => {
  const { sendRequest, error } = useHttpClient();
  const [data, setData] = useState<IPostAdminData>({
    postId: "",
    post_code: ""
  });
  const { userId } = useUserData();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(dataStatusUIAction.setErrorHandler(error));
  // }, [error, dispatch]);

  // useEffect(() => {
  //   let fetchExamData = () => {};

  //   fetchExamData = async () => {
  //     try {
  //       const response = await sendRequest(
  //         `${process.env.REACT_APP_BASE_URL}/admin/public/admin_exam_data`,
  //         "GET",
  //         null,
  //         {
  //           userid: userId || "",
  //         }
  //       );
  //       const responseData: AdminExamProps =
  //         response.data as unknown as AdminExamProps;
  //       setExamData(responseData);
  //     } catch (err) {}
  //   };

  //   fetchExamData();
  // }, [sendRequest, userId]);

  return data;
};
