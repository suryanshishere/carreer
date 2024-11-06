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
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import useUserData from "shared/utilComponents/hooks/user-data-hook";

const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

interface IForgotPassword {
  email: string;
}

const ForgotPassword: React.FC<AuthProps> = ({ onBack, classProp }) => {
  const dispatch = useDispatch();
  const { userId } = useUserData();
  const [reached, setReached] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForgotPassword>({
    resolver: yupResolver(validationSchema),
    mode: "onSubmit",
  });

  const submitMutation = useMutation({
    mutationFn: async (data: IForgotPassword) => {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/user/auth/send_password_reset_link`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
            userid: userId,
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(dataStatusUIAction.setResMsg(data.message));
      if (onBack) {
        onBack();
      }
      setReached(true);
    },
    onError: (error: any) => {
      dispatch(
        dataStatusUIAction.setErrorHandler(`${error.response?.data?.message}`)
      );
    },
  });

  const submitHandler: SubmitHandler<IForgotPassword> = async (data) => {
    submitMutation.mutate(data);
  };

  if (reached) {
    return (
      <p className="text-base text-custom-green p-button font-bold">
        Reset password link sent successfully!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)} className={`${classProp}`}>
      <AuthForm
        forgotPassword
        inputClassProp="placeholder:text-sm"
        inputOuterClassProp="flex-1"
        register={register}
        errors={errors}
        onBack={onBack}
        pendingProp={submitMutation.isPending}
        buttonClassProp={`${
          submitMutation.isPending ? "bg-custom-black" : "bg-custom-grey"
        } py-2 rounded-full  text-white font-bold px-3 hover:bg-custom-black`}
      />
    </form>
  );
};

export default ForgotPassword;
