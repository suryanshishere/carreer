import React, { useEffect, useState } from "react";
import Loading from "src/shared/components/uiElements/common/response/Loading";
import Error from "src/shared/components/uiElements/common/response/Response&Error";
import Form, { FormSubmitHandler } from "../../auth/Form";
import useAuth  from "src/shared/hooks/auth";
import { useHttpClient } from "src/shared/hooks/http";
import "./ChangePassword.css";
import { useDispatch } from "react-redux";
import { responseUIAction } from "src/shared/store/reponse-ui-slice";

interface ChangePasswordProps {
  onMsg: (msg: string) => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ onMsg }) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const { token } = useAuth();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(responseUIAction.setErrorHandler(error));
    dispatch(responseUIAction.isLoadingHandler(isLoading));
  }, [error, isLoading, clearError, dispatch]);

  const authSubmitHandler: FormSubmitHandler = async (formState) => {
    if (
      formState.password.value.trim() !== "" &&
      formState.password.value === formState.newPassword?.value
    ) {
      return dispatch(
        responseUIAction.setErrorHandler("Password seem exactly same")
      );
    }
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BASE_URL}/users/change-password`,
        "POST",
        JSON.stringify({
          email: formState.email.value,
          password: formState.password.value,
          newPassword: formState.newPassword?.value,
        }),
        {
          Authorization: "bearer " + token,
          "Content-Type": "application/json",
        }
      );

      const responseData = response.data as unknown as { message: string };

      onMsg(responseData.message);
    } catch (err) {}
  };

  return (
    <div className="w-full mt-4">
      <Form onFormSubmit={authSubmitHandler} changePassword />
    </div>
  );
};

export default ChangePassword;
