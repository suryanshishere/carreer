import React, { useEffect, useState } from "react";
import Error from "src/shared/components/uiElements/common/response/Response&Error";
import Loading from "src/shared/components/uiElements/common/response/Loading";
import { useHttpClient } from "src/shared/hooks/http";
import Form, { FormSubmitHandler } from "src/user/components/auth/Form";
import { AuthProps } from "src/user/pages/auth/Auth";
import Para from "src/shared/components/uiElements/cover/Para";

const ResetPassword: React.FC<AuthProps> = ({ onBackLogin, onBack, timer }) => {
  const { isLoading, error, sendRequest } = useHttpClient();
  const [timeLeft, setTimeLeft] = useState<number | undefined>(timer);

  const authSubmitHandler: FormSubmitHandler = async (formState) => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BASE_URL}/users/auth/reset-password`,
        "POST",
        JSON.stringify({
          email: formState.email!.value,
          otp: formState.otp!.value,
          password: formState.password.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );

      if (onBackLogin) {
        onBackLogin();
      }
    } catch (err) {
      // Handle error
    }
  };

  useEffect(() => {
    if (timer === undefined || timer <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === undefined || prevTime <= 0) {
          clearInterval(interval);
          if (onBack) {
            onBack();
          }
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onBack, timer]);

  // Convert milliseconds to minutes and seconds
  let minutes,
    seconds: number = 0;
  if (timeLeft !== undefined) {
    minutes = Math.floor(timeLeft / (1000 * 60)); // Convert milliseconds to minutes
    seconds = Math.floor((timeLeft % (1000 * 60)) / 1000); // Convert remaining milliseconds to seconds
  }

  return (
    <div className="authentication">
      {isLoading && <Loading />}
      {error && !isLoading && <Error error={error} />}

      {timeLeft !== undefined ? (
        <div className="w-full flex justify-end">
          <Para
            className="text-center text-sm mr-3 mb-3"
            style={{ color: "var(--color-brown)" }}
          >
            Time left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </Para>
        </div>
      ) : (
        <p>Timer expired or not set</p>
      )}

      <Form onFormSubmit={authSubmitHandler} onBack={onBack} resetPassword />
    </div>
  );
};

export default ResetPassword;
