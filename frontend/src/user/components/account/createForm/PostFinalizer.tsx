import React, { useEffect, useState } from "react";
import { useHttpClient } from "shared/utilComponents/hooks/http-hook";
import { useNavigate, useParams } from "react-router-dom";
import useUserData from "shared/utilComponents/localStorageConfig/use-userData-hook";
import { IContributeInputForm } from "models/userModel/account/contributeToPost/IContributeInputForm";
import { IPostAdminData } from "models/admin/IPostAdminData";
import Button from "shared/utilComponents/form/Button";
import { Dropdown } from "shared/utilComponents/form/input/Dropdown";
import PostSectionForm from "./PostSectionForm";
import { useDispatch } from "react-redux";
import { undefinedFieldActions } from "shared/utilComponents/store/undefined-fields";
import { formatWord } from "shared/uiComponents/uiUtilComponents/format-word";
import { dataStatusUIAction } from "shared/utilComponents/store/data-status-ui";

const PostFinalizer = () => {
  const { sendRequest, error } = useHttpClient();
  const { userId, token } = useUserData();
  const [postIdData, setPostIdData] = useState<IPostAdminData[]>([]);
  const [undefinedFields, setUndefinedFields] = useState<string[]>([]);
  const { post_section } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BASE_URL}/admin/public/${post_section}/post_admin_data`,
          "GET",
          null,
          {
            userid: userId || "",
            Authorisation: "Bearer " + token,
          }
        );

        const responseData = response.data as unknown as {
          [key: string]: IPostAdminData[];
        };
        const firstKey = Object.keys(responseData)[0];
        const responseDataValue = responseData[firstKey] || [];
        if (responseDataValue.length === 0) {
          dispatch(dataStatusUIAction.setErrorHandler("No data found"));
          navigate(-1);
        }
        setPostIdData(responseDataValue);
      } catch (err) {}
    };
    fetchData();
  }, [post_section]);

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const postId = formData.get("post_id");

    if (!postId) {
      // Handle error if postId is not selected
      return;
    }

    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BASE_URL}/user/account/undefined_fields/${post_section}/${postId}`,
        "GET",
        null,
        {
          userid: userId || "",
          authorisation: "Bearer " + token,
        }
      );

      //TODO: dispatch the message

      const responseData = response.data as unknown as {
        message: string;
        undefinedFields: string[];
      };

      dispatch(undefinedFieldActions.setFields(responseData.undefinedFields));

      navigate(`${postId}`);
    } catch (err) {}
  };

  return (
    <form onSubmit={submitHandler} className="flex flex-col gap-2">
      <h3>{formatWord(`${post_section}`)}</h3>
      <Dropdown name="post_id" dropdownData={postIdData} />
      <Button>Select</Button>
    </form>
  );
};

export default PostFinalizer;
