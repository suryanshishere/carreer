import React from "react";
import Error from "src/shared/components/uiElements/common/response/Response&Error";
import Loading from "src/shared/components/uiElements/common/response/Loading";
import { useHttpClient } from "src/shared/hooks/http";
import Form, { FormSubmitHandler } from "src/user/components/auth/Form";
import { AuthProps } from "src/user/pages/auth/Auth";

const ForgotPassword: React.FC<AuthProps> = ({
  resetPasswordClicked,
  onBack,
  timerForward,
}) => {
  const { isLoading, error, sendRequest } = useHttpClient();

  const authSubmitHandler: FormSubmitHandler = async (formState) => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BASE_URL}/users/auth/forgot-password`,
        "POST",
        JSON.stringify({
          email: formState.email.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );

      const response = await sendRequest(
        `${process.env.REACT_APP_BASE_URL}/users/auth/reset-password/timer`,
        "POST",
        JSON.stringify({
          email: formState.email.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );

      const responseData = response.data as unknown as number;
      if (timerForward && resetPasswordClicked) {
        timerForward(responseData);
        resetPasswordClicked();
      }
    } catch (err) {}
  };

  return (
    <div className="authentication">
      {isLoading && <Loading />}
      {error && !isLoading && <Error error={error} />}
      <Form onFormSubmit={authSubmitHandler} onBack={onBack} forgotPassword />
    </div>
  );
};

export default ForgotPassword;
