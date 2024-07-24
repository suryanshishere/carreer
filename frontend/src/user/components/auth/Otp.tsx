import React, { useContext } from "react";
import { useHttpClient } from "shared/hooks/http-hook";
import Form, { FormSubmitHandler } from "./Form";
import Loading from "shared/feedback/dataStatus/Loading";
import Error from "shared/feedback/dataStatus/DataStatus";
import { AuthProps } from "user/pages/auth/Auth";
import { AuthContext } from "shared/context/auth-context";
import Para from "shared/components/uiElements/cover/Para";

const Otp: React.FC<AuthProps> = ({
  signupData,
  onClose,
  onBack,
  onBackLogin,
}) => {
  const { isLoading, error, sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);

  const authSubmitHandler: FormSubmitHandler = async (formState) => {
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BASE_URL}/users/auth/signup-otp`,
        "POST",
        JSON.stringify({
          email: signupData?.email,
          otp: formState.otp!.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      const responseData = response.data as unknown as {
        userId: string;
        token: string;tokenExpiration:string
      };
      auth.login(responseData.userId, responseData.token, responseData.tokenExpiration);
      if (onClose) {
        onClose();
      }
    } catch (error) {}
  };

  return (
    <div className="authentication">
      {!error && (
        <div className="w-full flex justify-center">
          <Para
            className="text-center text-sm w-2/3 mb-3"
            style={{ color: "var(--color-green)" }}
          >{`Verify your ${signupData?.email}, please check the otp received`}</Para>
        </div>
      )}
      {isLoading && <Loading />}
      {error && !isLoading && <Error error={error} />}
      <Form onFormSubmit={authSubmitHandler} onBackLogin={onBackLogin} otp />
    </div>
  );
};

export default Otp;
