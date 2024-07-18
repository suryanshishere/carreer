import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { DetailPage, RelatedDetailPage } from "models/exam/IDetail";
import { useHttpClient } from "shared/hooks/http-hook";
import { responseUIAction } from "shared/store/reponse-ui-slice";
import CreateForm from "user/components/account/create/CreateForm";
import { getUserData } from "shared/localStorageConfig/auth-local-storage";

const Create: React.FC = () => {
  const userData = getUserData();
  const { userId, token } = userData;
  const { sendRequest, isLoading, error } = useHttpClient();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(responseUIAction.setErrorHandler(error));
    dispatch(responseUIAction.isLoadingHandler(isLoading));
  }, [error, isLoading, dispatch]);

  const submitHandler = async (convertedJson: RelatedDetailPage[]) => {
    console.log(convertedJson);
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BASE_URL}/users/${userId}/create_exam`,
        "POST",
        JSON.stringify({ examFormData: convertedJson }),
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