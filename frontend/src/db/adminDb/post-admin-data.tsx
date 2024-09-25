import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { IPostAdminData } from "models/admin/IPostAdminData";
import { useHttpClient } from "shared/utilComponents/hooks/http-hook";
import { dataStatusUIAction } from "shared/utilComponents/store/data-status-ui";

interface UsePostAdminDataProps {
  postSection: string | null;
}

export const usePostAdminData = ({ postSection }: UsePostAdminDataProps) => {
  const { sendRequest, error } = useHttpClient();
  const [data, setData] = useState<IPostAdminData>({
    _id: "",

      name_of_the_post: "",

  });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(dataStatusUIAction.setErrorHandler(error));
  }, [error]);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BASE_URL}/admin/public/post_admin_data`,
          "POST",
          JSON.stringify({ post_section: postSection }),
          {
            "Content-Type": "application/json",
          }
        );
        const responseData = response.data as unknown as IPostAdminData;
        setData(responseData);
      } catch (err) {}
    };

    fetchExamData();
  }, []);

  if (postSection === null) return null;
  return data;
};
