import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "shared/utils/api/axios-instance";
import Button from "shared/utils/form/Button";
import { Input } from "shared/utils/form/Input";
import { AppDispatch } from "shared/store";
import {
  triggerErrorMsg,
  triggerSuccessMsg,
} from "shared/store/thunks/response-thunk";
import { logout } from "shared/store/user_slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PageHeader from "shared/ui/PageHeader";

// Validation schema using Yup
const validationSchema = yup.object({
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

interface IDeactivateForm {
  password: string;
}

const DeactivateAccount: React.FC = () => {
  const [confirm, setConfirm] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IDeactivateForm>({
    resolver: yupResolver(validationSchema),
  });

  // React Query Mutation
  const deactivateMutation = useMutation({
    mutationFn: async (data: IDeactivateForm) => {
      const response = await axiosInstance.post(
        "/user/account/setting/deactivate-account",
        JSON.stringify(data)
      );
      return response.data;
    },
    onSuccess: ({ message }) => {
      navigate("/");
      dispatch(
        triggerSuccessMsg(message || "Account deactivated successfully!")
      );
      dispatch(logout());
    },
    onError: (error: any) => {
      dispatch(
        triggerErrorMsg(
          error.response?.data?.message || "Failed to deactivate account."
        )
      );
    },
  });

  const onSubmit: SubmitHandler<IDeactivateForm> = (data) => {
    deactivateMutation.mutate(data);
  };

  return (
    <div className="w-full flex flex-col justify-center">
      <PageHeader
        header="Deactivate Account"
        subHeader="Read the warming first, before any action"
      />
      <p className="text-custom_red text-justify font-bold mb-4">
        If you deactivate your account, it may be permanently deleted after 30
        days of inactivity. All saved posts will also be deleted, so ensure you
        back them up elsewhere.
      </p>
      <div className="lg:w-3/5 flex items-end gap-2">
        {!confirm ? (
          <Button
            classProp="w-full transform ease-linear duration-100"
            warning
            onClick={() => setConfirm(true)}
          >
            CONFIRMED
          </Button>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-3"
          >
            <Input
              label="Enter your password"
              type="password"
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register("password")}
            />
            <div className="flex justify-between items-center gap-2">
              <Button iconButton onClick={() => navigate(-1)}>
                <ArrowBackIcon fontSize="medium" />
              </Button>
              <Button
                type="submit"
                warning
                classProp="flex-1"
                disabled={deactivateMutation.isPending}
              >
                {deactivateMutation.isPending
                  ? "Deactivating..."
                  : "Deactivate"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default DeactivateAccount;
