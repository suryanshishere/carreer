import React from "react";
import { AuthProps } from "user/pages/auth/Auth";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AuthForm from "./AuthForm";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "shared/store";
import {
  triggerErrorMsg,
  triggerSuccessMsg,
} from "shared/store/thunks/response-thunk";
import { handleAuthClick, login } from "shared/store/auth-slice";
import axiosInstance from "shared/utils/api/axios-instance";

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

const AuthComponent: React.FC<AuthProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
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
  const submitMutation = useMutation({
    mutationFn: async (data: IAuth) => {
      const response = await axiosInstance.post(
        `user/auth`,
        JSON.stringify(data),
        {}
      );
      return response.data;
    },
    onSuccess: ({
      email,
      userId,
      token,
      tokenExpiration,
      isEmailVerified,
      message,
    }) => {
      dispatch(
        login({ email, userId, token, tokenExpiration, isEmailVerified })
      );
      dispatch(triggerSuccessMsg(message));

      if (isEmailVerified) {
        dispatch(handleAuthClick(false));
      }
    },
    onError: (error: any) => {
      dispatch(triggerErrorMsg(`${error.response?.data?.message}`));
    },
  });

  const submitHandler: SubmitHandler<IAuth> = async (data) => {
    submitMutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="h-5/6 flex-1 flex items-center gap-2 justify-end"
    >
      <AuthForm
        register={register}
        errors={errors}
        inputClassProp="placeholder:text-sm"
        inputOuterClassProp="flex-1"
        pendingProp={submitMutation.isPending}
        buttonClassProp={`${
          submitMutation.isPending ? "bg-custom-black" : "bg-custom-grey"
        } py-2 rounded-full  text-white font-bold px-3 hover:bg-custom-black`}
      />
    </form>
  );
};

export default AuthComponent;
