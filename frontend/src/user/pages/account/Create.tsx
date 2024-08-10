import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
// import { DetailPage, RelatedDetailPage } from "models/post/IDetail";
import { useHttpClient } from "shared/hooks/http-hook";
import { dataStatusUIAction } from "shared/store/dataStatus-ui-slice";
import CreateForm from "user/components/account/create/CreateForm";
import useUserData from "shared/localStorageConfig/use-userData-hook";

const Create: React.FC = () => {
  const { token, userId } = useUserData();

  const { sendRequest,  error } = useHttpClient();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(dataStatusUIAction.setErrorHandler(error));
  }, [error,  dispatch]);

  const submitHandler = async (
    // convertedJson: RelatedDetailPage[]
    ) => {
    // console.log(convertedJson);
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BASE_URL}/users/${userId}/create_exam`,
        "POST",
        // JSON.stringify({ examFormData: convertedJson }),
        {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        }
      );

      console.log(responseData);
    } catch (error) {}
  };

  return (
    <div>
      <CreateForm onSubmit={submitHandler} />
    </div>
  );
};

export default Create;
