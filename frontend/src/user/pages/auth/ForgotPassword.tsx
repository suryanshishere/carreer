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
import { useLocation, useNavigate } from "react-router-dom";
import { AuthProps } from "user/pages/auth/Auth";
import axiosInstance from "shared/utils/api/axios-instance";
import Button from "shared/utils/form/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Input } from "shared/utils/form/Input";
import PageHeader from "shared/ui/PageHeader";
import IconButton from "@mui/material/IconButton";

const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

interface IForgotPassword {
  email: string;
}

const ForgotPassword: React.FC<AuthProps> = ({ onBack }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth.userData);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForgotPassword>({
    resolver: yupResolver(validationSchema),
    mode: "onSubmit",
  });

  const location = useLocation();
  const isForgotPasswordPage =
    location.pathname === "/user/account/setting/forgot-password";

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

  const backHandler = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
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
        isForgotPasswordPage
          ? "lg:w-2/3 flex flex-col gap-3"
          : "flex-1 flex flex-col md:flex-row md:items-center gap-2"
      }
    >
      <Input
        {...register("email")}
        type="email"
        label={isForgotPasswordPage ? "Email" : undefined}
        error={!!errors.email}
        helperText={errors.email?.message}
        placeholder="Email"
        classProp={`placeholder:text-sm outline-custom-gray`}
        outerClassProp={`flex-1`}
      />
      <div className="flex-1 flex items-center gap-2">
        <IconButton aria-label="delete" size="medium">
          <ArrowBackIcon onClick={backHandler} fontSize="medium" />
        </IconButton>
        <Button
          authButtonType={!isForgotPasswordPage}
          outline={isForgotPasswordPage ? true : undefined}
          disabled={submitMutation.isPending}
          classProp="w-full"
          type="submit"
        >
          {submitMutation.isPending
            ? "Sending reset password link.."
            : "Send reset password link"}
        </Button>
      </div>
    </form>
  );

  return isForgotPasswordPage ? (
    <div className="w-full flex flex-col gap-4">
      <PageHeader
        header="Forgot Password"
        subHeader={<>Make your email handy</>}
      />

      {formContent}
    </div>
  ) : (
    formContent
  );
};

export default ForgotPassword;
