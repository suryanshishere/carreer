import React, { useContext, useEffect, useState } from "react";
import { Input } from "shared/utils/form/Input";
import { useNavigate, useParams } from "react-router-dom";
import Button from "shared/utils/form/Button";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import ForgotPassword from "../../pages/auth/ForgotPassword";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import {
  triggerErrorMsg,
  triggerSuccessMsg,
} from "shared/store/thunks/response-thunk";
import axiosInstance from "shared/utils/api/axios-instance";

const validationSchema = yup.object().shape({
  new_password: yup.string().required("New password is required"),
  confirm_new_password: yup
    .string()
    .oneOf([yup.ref("new_password")], "Passwords must match")
    .required("Confirm new password is required"),
});

interface IResetPasswordForm {
  new_password: string;
  confirm_new_password: string;
}

const ResetPassword: React.FC = () => {
  const { resetPasswordToken } = useParams<{ resetPasswordToken: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [reached, setReached] = useState<boolean>(false);
  const navigate = useNavigate();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IResetPasswordForm>({
    resolver: yupResolver(validationSchema),
  });

  const userId = resetPasswordToken?.slice(0, -6);

  // Mutation for resetting the password
  const submitMutation = useMutation({
    mutationFn: async (data: IResetPasswordForm) => {
      const response = await axiosInstance.post(
        `user/auth/reset-password/${userId}`,
        JSON.stringify({
          resetPasswordToken: Number(resetPasswordToken?.slice(-6)),
          password: data.new_password,
        }),
        {}
      );
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(triggerSuccessMsg(data.message));
      navigate("/");
    },
    onError: (error: any) => {
      dispatch(triggerErrorMsg(`${error.response?.data?.message}`));
      if (error.response.status === 410) {
        setReached(true);
      }
    },
  });

  // Handle form submission
  const submitHandler: SubmitHandler<IResetPasswordForm> = (data) => {
    submitMutation.mutate(data);
  };
  const isValidObjectId = (id: string) => /^[0-9a-f]{24}$/.test(id);

  if (
    reached ||
    resetPasswordToken?.length !== 30 ||
    (userId && !isValidObjectId(userId))
  )
    return (
      <div className="w-full flex flex-col gap-4 items-center">
        {!reached && (
          <div className="text-center text-custom_red">
            Not a valid reset password link. <br />
            <b>Try again</b> if problem persist.
          </div>
        )}
        <ForgotPassword classProp="w-2/3 flex flex-col gap-2" />
      </div>
    );

  return (
    <div className="w-full flex justify-center">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="w-2/3 flex flex-col gap-3"
      >
        <Input
          {...register("new_password")}
          type="password"
          label="New password"
          error={!!errors.new_password}
          helperText={errors.new_password?.message}
        />
        <Input
          {...register("confirm_new_password")}
          type="password"
          label="Confirm new password"
          error={!!errors.confirm_new_password}
          helperText={errors.confirm_new_password?.message}
        />
        <Button type="submit" classProp="ml-auto" outline>
          {submitMutation.isPending
            ? "Submitting Reset Password.."
            : "Reset Password"}
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
