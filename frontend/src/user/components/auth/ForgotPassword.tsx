import React, { useEffect, useState } from "react";
import Error from "shared/utilComponents/response/dataStatus/DataStatus";
import Loading from "shared/utilComponents/response/dataStatus/Loading";
import { useHttpClient } from "shared/utilComponents/hooks/http-hook";
import Form, { FormSubmitHandler } from "user/components/auth/AuthForm";
import { AuthProps } from "user/pages/auth/Auth";
import Response from "shared/utilComponents/response/Response";
import { useDispatch } from "react-redux";
import { dataStatusUIAction } from "shared/utilComponents/store/dataStatus-ui-slice";

const ForgotPassword: React.FC<AuthProps> = ({ onBack }) => {
  const { isLoading, error, sendRequest } = useHttpClient();
  const [response, setResponse] = useState<string>("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(dataStatusUIAction.setErrorHandler(error));
  }, [error, dispatch]);

  const authSubmitHandler: FormSubmitHandler = async (formState) => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BASE_URL}/users/auth/forgot_password`,
        "POST",
        JSON.stringify({
          email: formState.email.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      setResponse(responseData.data.message as string);
    } catch (err) {}
  };

  return (
    <div className="authentication">
      {isLoading && <Loading />}
      {response?.length > 0 ? (
        response
      ) : (
        <Form onFormSubmit={authSubmitHandler} onBack={onBack} forgotPassword />
      )}
    </div>
  );
};

export default ForgotPassword;
