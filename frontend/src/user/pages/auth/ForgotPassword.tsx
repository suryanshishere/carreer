import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import {
  triggerErrorMsg,
  triggerSuccessMsg,
} from "shared/store/thunks/response-thunk";
import { useLocation } from "react-router-dom";
import { AuthProps } from "user/pages/auth/Auth";
import axiosInstance from "shared/utils/api/axios-instance";
import Button from "shared/utils/form/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Input } from "shared/utils/form/Input";

const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

interface IForgotPassword {
  email: string;
}

const ForgotPassword: React.FC<AuthProps> = ({ onBack }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth.userData);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForgotPassword>({
    resolver: yupResolver(validationSchema),
    mode: "onSubmit",
  });

  const location = useLocation();
  const isForgotPasswordPage = location.pathname === "/user/account/setting/forgot-password";

  const submitMutation = useMutation({
    mutationFn: async (data: IForgotPassword) => {
      const response = await axiosInstance.post(
        `user/auth/send-password-reset-link`,
        JSON.stringify(data),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    },
    onSuccess: ({ message }) => {
      {
        !isForgotPasswordPage && dispatch(triggerSuccessMsg(message));
      }
      if (onBack) {
        onBack();
      }
    },
    onError: (error: any) => {
      dispatch(triggerErrorMsg(`${error.response?.data?.message}`));
    },
  });

  const submitHandler: SubmitHandler<IForgotPassword> = async (data) => {
    submitMutation.mutate(data);
  };

  if (submitMutation.isSuccess) {
    return (
      <p className="text-base text-center text-custom-green p-button font-bold">
        Password reset link sent successfully!
      </p>
    );
  }

  const formContent = (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className={
        isForgotPasswordPage ? "w-1/2 flex flex-col gap-2" : "flex-1 flex items-center gap-2 justify-end"
      }
    >
      <Input
        {...register("email")}
        type="email"
        label={isForgotPasswordPage ? "Email" : undefined}
        error={!!errors.email}
        helperText={errors.email?.message}
        placeholder="Email"
        classProp={`placeholder:text-sm`}
        outerClassProp={`flex-1`}
      />
      {onBack && (
        <button className="rounded-full flex items-center justify-center p-1 hover:bg-custom-super-less-gray" onClick={onBack}>
          <ArrowBackIcon />
        </button>
      )}
      <Button
        authButtonType={!isForgotPasswordPage}
        outline={isForgotPasswordPage ? true : undefined}
        classProp={
          !isForgotPasswordPage
            ? `${
                submitMutation.isPending ? "bg-custom-black" : "bg-custom-gray"
              } py-2 rounded-full text-white font-bold px-3 hover:bg-custom-black`
            : undefined
        }
        type="submit"
      >
        {submitMutation.isPending
          ? "Sending reset password link.."
          : "Send reset password link"}
      </Button>
    </form>
  );

  return isForgotPasswordPage ? (
    <div className="w-full flex justify-center">{formContent}</div>
  ) : (
    formContent
  );
};

export default ForgotPassword;
