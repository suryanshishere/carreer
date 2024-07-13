import React, { useContext } from "react";
import { AuthContext } from "src/shared/context/auth-context";
import { useHttpClient } from "src/shared/hooks/http";
import Form, { FormSubmitHandler } from "./Form";
import Loading from "src/shared/components/uiElements/common/response/Loading";
import Error from "src/shared/components/uiElements/common/response/Response&Error";
import { AuthProps } from "src/user/pages/auth/Auth";
import "./Auth.css";

const AuthComponent: React.FC<AuthProps> = ({
  forgotPasswordClicked,
  signupOTP,
  onClose,
  signupDataForwardHandler,
}) => {
  const auth = useContext(AuthContext);

  const { isLoading, error, sendRequest } = useHttpClient();

  const authSubmitHandler: FormSubmitHandler = async (formState) => {
    try {
      let responseData;

      if (formState.isLoginMode) {
        const response = await sendRequest(
          `${process.env.REACT_APP_BASE_URL}/users/auth/login`,
          "POST",
          JSON.stringify({
            email: formState.email.value,
            password: formState.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );

        responseData = response.data as unknown as {
          userId: string;
          token: string;
          message: string;
          tokenExpiration:string;
        };
        auth.loginAndRefresh(responseData.userId, responseData.token, responseData.tokenExpiration);
        if (onClose) {
          onClose();
        }
      } else {
        const response = await sendRequest(
          `${process.env.REACT_APP_BASE_URL}/users/auth/signup`,
          "POST",
          JSON.stringify({
            name: formState.name!.value,
            email: formState.email.value,
            password: formState.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );

        responseData = response.data as unknown as {
          userId: string;
          token: string;
          message: string;
          tokenExpiration:string;
        };

        auth.loginAndRefresh(responseData.userId, responseData.token, responseData.tokenExpiration);
      }
    } catch (error) {}
  };


  return (
    <div className="authentication">
      {isLoading && <Loading />}
      {error && !isLoading && <Error error={error} />}
      <hr />
      <Form
        onFormSubmit={authSubmitHandler}
        forgotPasswordClicked={forgotPasswordClicked}
      />
    </div>
  );
};

export default AuthComponent;
