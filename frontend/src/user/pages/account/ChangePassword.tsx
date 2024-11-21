import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import Button from "shared/utils/form/Button";
import { Input } from "shared/utils/form/input/Input";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import {
  triggerErrorMsg,
  triggerSuccessMsg,
} from "shared/store/thunks/response-thunk";
import axiosInstance from "shared/utils/api/axios-instance";
import { Link } from "react-router-dom";

// Validation schema using Yup
const validationSchema = yup.object().shape({
  old_password: yup.string().required("Old password is required"),
  new_password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirm_new_password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .oneOf([yup.ref("new_password")], "Passwords must match")
    .required("Confirm password is required"),
  old_password_not_match: yup
    .string()
    .test(
      "not-same",
      "Old password cannot be the same as new password",
      function (value) {
        const { old_password, new_password } = this.parent;

        // Only compare if both old_password and new_password are longer than 6 characters
        if (old_password.length > 6 && new_password.length > 6) {
          return old_password !== new_password; // Check if old_password and new_password are not the same
        }
        return true; // Skip the check if the length is not greater than 6 characters
      }
    ),
});

interface IChangePasswordForm {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
  old_password_not_match?: string;
}

const ChangePassword: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth.userData);
  // Set up React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IChangePasswordForm>({
    resolver: yupResolver(validationSchema),
    mode: "onSubmit",
  });

  // API mutation using Tanstack Query
  const changePasswordMutation = useMutation({
    mutationFn: async (data: IChangePasswordForm) => {
      const response = await axiosInstance.post(
        `user/account/change-password`,
        JSON.stringify(data),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(
        triggerSuccessMsg(data.message || "Password changed successfully")
      );
    },
    onError: (error: any) => {
      dispatch(
        triggerErrorMsg(
          `${error.response?.data?.message || "Something went wrong"}`
        )
      );
    },
  });

  const submitHandler: SubmitHandler<IChangePasswordForm> = (data) => {
    changePasswordMutation.mutate(data);
  };

  return (
    <div className="w-full flex flex-col gap-4 items-center">
      <p className="text-custom-red">
        {errors.old_password_not_match?.message}
      </p>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="w-1/2 flex flex-col gap-4"
      >
        <div className="gap-2 flex flex-col">
          <Input
            // name="old_password"
            label="Old Password"
            type="password"
            error={!!errors.old_password}
            helperText={errors.old_password?.message}
            {...register("old_password")}
          />
          <Input
            // name="new_password"
            label="New Password"
            type="password"
            error={!!errors.new_password}
            helperText={errors.new_password?.message}
            {...register("new_password")}
          />
          <Input
            // name="confirm_new_password"
            label="Confirm New Password"
            type="password"
            error={!!errors.confirm_new_password}
            helperText={errors.confirm_new_password?.message}
            {...register("confirm_new_password")}
          />
        </div>
        <div className="flex justify-between items-center gap-8">
          <Link to="/user/forgot-password" className="text-custom-red text-sm">
            Forgot Password?
          </Link>
          <Button
            outline
            type="submit"
            disabled={changePasswordMutation.isPending}
            classProp="flex-1"
          >
            {changePasswordMutation.isPending
              ? "Processing..."
              : "Change Password"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
