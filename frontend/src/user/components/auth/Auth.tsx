import React, { useContext, useEffect, useCallback } from "react";
import { AuthContext } from "shared/utilComponents/context/auth-context";
import { useHttpClient } from "shared/utilComponents/hooks/http-hook";
import Form, { FormSubmitHandler } from "./AuthForm";
import Loading from "shared/utilComponents/response/dataStatus/Loading";
import Error from "shared/utilComponents/response/dataStatus/DataStatus";
import { AuthProps } from "user/pages/auth/Auth";
import { useDispatch } from "react-redux";
import { dataStatusUIAction } from "shared/utilComponents/store/dataStatus-ui-slice";
import "./Auth.css";

const AuthComponent: React.FC<AuthProps> = ({
  forgotPasswordClicked,
  onClose,
}) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, clearError, sendRequest } = useHttpClient();
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      dispatch(dataStatusUIAction.setErrorHandler(error));
    }
  }, [error, dispatch]);

  const authSubmitHandler: FormSubmitHandler = useCallback(
    async (formState) => {
      try {
        const url = formState.isLoginMode
          ? `${process.env.REACT_APP_BASE_URL}/users/auth/login`
          : `${process.env.REACT_APP_BASE_URL}/users/auth/signup`;

        const body = JSON.stringify(
          formState.isLoginMode
            ? {
                email: formState.email.value,
                password: formState.password.value,
              }
            : {
                name: formState.name!.value,
                email: formState.email.value,
                password: formState.password.value,
              }
        );

        const response = await sendRequest(url, "POST", body, {
          "Content-Type": "application/json",
        });

        const responseData = response.data as {
          email: string;
          userId: string;
          token: string;
          message: string;
          tokenExpiration: string;
          emailVerified: boolean;
        };

        auth.login(
          responseData.email,
          responseData.userId,
          responseData.token,
          responseData.tokenExpiration,
          responseData.emailVerified
        );

        if (onClose) {
          onClose();
        }
      } catch (error) {
        // Optionally handle specific errors here
      }
    },
    [auth, sendRequest, onClose]
  );

  return (
    <div className="authentication">
      {isLoading && <Loading />}
      {error && !isLoading && <Error error={error} clearError={clearError} />}
      <hr />
      <Form
        onFormSubmit={authSubmitHandler}
        forgotPasswordClicked={forgotPasswordClicked}
      />
    </div>
  );
};

export default AuthComponent;
