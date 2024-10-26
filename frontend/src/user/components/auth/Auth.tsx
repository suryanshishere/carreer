import React, { useContext, useEffect } from "react";
import { AuthContext } from "shared/utilComponents/context/auth-context";
import { useHttpClient } from "shared/utilComponents/hooks/http-hook";
import { AuthProps } from "user/pages/auth/Auth";
import { useDispatch } from "react-redux";
import { dataStatusUIAction } from "shared/utilComponents/store/data-status-ui";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AuthForm from "./AuthForm";

// Validation schema using Yup
const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

interface IAuth {
  email: string;
  password: string;
}

const AuthComponent: React.FC<AuthProps> = ({
  forgotPasswordClicked,
  onClose,
}) => {
  const auth = useContext(AuthContext);
  const { error, sendRequest } = useHttpClient();
  const dispatch = useDispatch();

  // Handle error state
  useEffect(() => {
    if (error) {
      dispatch(dataStatusUIAction.setErrorHandler(error));
    }
  }, [error, dispatch]);

  // Setup form with React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAuth>({
    resolver: yupResolver(validationSchema),
    mode: "onSubmit",
  });

  // Form submission handler
  const submitHandler: SubmitHandler<IAuth> = async (data) => {
    const url = `${process.env.REACT_APP_BASE_URL}/user/auth`;

    try {
      const response = await sendRequest(url, "POST", data, {
        "Content-Type": "application/json",
      });

      const { email, userId, token, tokenExpiration, emailVerified } =
        response.data as {
          email: string;
          userId: string;
          token: string;
          message: string;
          tokenExpiration: string;
          emailVerified: boolean;
        };

      auth.login(email, userId, token, tokenExpiration, emailVerified);

      if (onClose) {
        onClose();
      }
    } catch (error) {}
  };

  return (
    <div className="h-16 py-1 w-full px-page bg-custom-white flex items-center justify-end z-20">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="h-full flex items-center gap-2 text-base"
      >
        <AuthForm
          register={register}
          errors={errors}
          forgotPasswordClicked={forgotPasswordClicked}
        />
      </form>
    </div>
  );
};

export default AuthComponent;
