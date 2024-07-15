import React, { useContext, useEffect } from "react";
import { AuthContext } from "shared/context/auth-context";
import { useHttpClient } from "shared/hooks/http-hook";
import Form, { FormSubmitHandler } from "./Form";
import Loading from "shared/components/feedback/response/Loading";
import Error from "shared/components/feedback/response/Response";
import { AuthProps } from "user/pages/auth/Auth";
import "./Auth.css";
import { useDispatch } from "react-redux";
import { responseUIAction } from "shared/store/reponse-ui-slice";

const AuthComponent: React.FC<AuthProps> = ({
  forgotPasswordClicked,
  onClose,
}) => {
  const auth = useContext(AuthContext);

  const { isLoading, error, clearError, sendRequest } = useHttpClient();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(responseUIAction.setErrorHandler(error));
    dispatch(responseUIAction.isLoadingHandler(isLoading));
  }, [error, isLoading, clearError, dispatch]);

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
          tokenExpiration: string;
          emailVerified: boolean;
        };

        auth.login(
          responseData.userId,
          responseData.token,
          responseData.tokenExpiration
        );

        if (!responseData.emailVerified) {
          dispatch(
            responseUIAction.setResponseHandler("Verify your your email.")
          );
        }

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
          tokenExpiration: string;
          emailVerified: boolean;
        };

        console.log(responseData)

        auth.login(
          responseData.userId,
          responseData.token,
          responseData.tokenExpiration
        );

        if (!responseData.emailVerified) {
          dispatch(
            responseUIAction.setResponseHandler(
              "Verification link sent to your email."
            )
          );
        }
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
