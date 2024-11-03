import React, { useContext, useEffect, useState } from "react";
import { useHttpClient } from "shared/utilComponents/hooks/http-hook";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AuthProps } from "user/pages/auth/Auth";
import { useDispatch } from "react-redux";
import { dataStatusUIAction } from "shared/utilComponents/store/data-status-ui";
import AuthForm from "user/components/auth/AuthForm";
import Button from "shared/utilComponents/form/Button";
import { AuthContext } from "shared/utilComponents/context/auth-context";

const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

interface IForgotPassword {
  email: string;
}

const ForgotPassword: React.FC<AuthProps> = ({ onBack }) => {
  const { isLoading, error, sendRequest } = useHttpClient();
  const [response, setResponse] = useState<string>("");
  const dispatch = useDispatch();
  const auth = useContext(AuthContext);

  useEffect(() => {
    dispatch(dataStatusUIAction.setErrorHandler(error));
  }, [error, dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForgotPassword>({
    resolver: yupResolver(validationSchema),
    mode: "onSubmit",
  });

  const submitHandler: SubmitHandler<IForgotPassword> = async (data) => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BASE_URL}/user/auth/forgot_password`,
        "POST",
        data,
        {
          "Content-Type": "application/json",
        }
      );
      setResponse(responseData.data.message as string);
    } catch (err) {}
  };

  return (
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="h-5/6 flex-1 flex items-center gap-2 justify-end"
      >
        <AuthForm
          forgotPassword
          inputClassProp="py-2 text-md rounded placeholder:text-sm"
          inputOuterClassProp="flex-1"
          buttonClassProp="py-2 rounded-full bg-custom-grey text-white font-bold px-3 hover:bg-custom-black hover:text-custom-white hover:border-custom-black"
          register={register}
          errors={errors}
          onBack={onBack}
        />
      </form>
  );
};

export default ForgotPassword;
