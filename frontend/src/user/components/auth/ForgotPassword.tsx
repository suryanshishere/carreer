import React from "react";
import Error from "shared/feedback/response/Response";
import Loading from "shared/feedback/response/Loading";
import { useHttpClient } from "shared/hooks/http-hook";
import Form, { FormSubmitHandler } from "user/components/auth/Form";
import { AuthProps } from "user/pages/auth/Auth";

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
