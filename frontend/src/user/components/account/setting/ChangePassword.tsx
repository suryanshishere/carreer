import React, { useEffect, useState } from "react";
import Form, { FormSubmitHandler } from "../../auth/AuthForm";
import { useHttpClient } from "shared/utilComponents/hooks/http-hook";
import "./ChangePassword.css";
import { useDispatch } from "react-redux";
import { dataStatusUIAction } from "shared/utilComponents/store/data-status-ui";
import useUserData from "shared/utilComponents/localStorageConfig/use-userData-hook";

interface ChangePasswordProps {
  onMsg: (msg: string) => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ onMsg }) => {
  const {  error, sendRequest, clearError } = useHttpClient();
  const { token, userId } = useUserData();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(dataStatusUIAction.setErrorHandler(error));
  }, [error,  clearError, dispatch]);

  const authSubmitHandler: FormSubmitHandler = async (formState) => {
    if (
      formState.password.value.trim() !== "" &&
      formState.password.value === formState.newPassword?.value
    ) {
      return dispatch(
        dataStatusUIAction.setErrorHandler("Password seem exactly same")
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
