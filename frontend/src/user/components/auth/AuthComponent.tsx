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

const AuthComponent: React.FC<AuthProps> = ({ onClose }) => {
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
      const response = await sendRequest(url, "POST", JSON.stringify(data), {
        "Content-Type": "application/json",
      });

      const {
        email,
        userId,
        token,
        message,
        tokenExpiration,
        isEmailVerified,
      } = response.data as {
        email: string;
        userId: string;
        token: string;
        message: string;
        tokenExpiration: string;
        isEmailVerified: boolean;
      };
      auth.login(email, userId, token, tokenExpiration, isEmailVerified);
      dispatch(dataStatusUIAction.setResMsg(message));
      auth.authClickedHandler(false);

      if (isEmailVerified && onClose) {
        onClose();
      }
    } catch (error) {}
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="h-5/6 flex-1 flex items-center gap-2 justify-end"
    >
      <AuthForm
        register={register}
        errors={errors}
        inputClassProp="py-2 text-md rounded placeholder:text-sm"
        inputOuterClassProp="flex-1"
        buttonClassProp="py-2 rounded-full bg-custom-grey text-white font-bold px-3 hover:bg-custom-black hover:text-custom-white hover:border-custom-black"
      />
    </form>
  );
};

export default AuthComponent;
