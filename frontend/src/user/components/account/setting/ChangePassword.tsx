import React, { useEffect, useState } from "react";
import Form, { FormSubmitHandler } from "../../auth/Form";
import { useHttpClient } from "shared/hooks/http-hook";
import "./ChangePassword.css";
import { useDispatch } from "react-redux";
import { responseUIAction } from "shared/store/reponse-ui-slice";
import useUserData from "shared/localStorageConfig/userData-hook";

interface ChangePasswordProps {
  onMsg: (msg: string) => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ onMsg }) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { token, userId } = useUserData();
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
