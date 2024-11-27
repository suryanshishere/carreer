import React from "react";
import { AuthProps } from "user/pages/auth/Auth";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { AppDispatch } from "shared/store";
import {
  triggerErrorMsg,
  triggerSuccessMsg,
} from "shared/store/thunks/response-thunk";
import { handleAuthClick, login } from "shared/store/auth-slice";
import axiosInstance from "shared/utils/api/axios-instance";
import { Input } from "shared/utils/form/input/Input";
import Button from "shared/utils/form/Button";

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
    onSuccess: ({ token, tokenExpiration, isEmailVerified, message }) => {
      dispatch(login({ token, tokenExpiration, isEmailVerified }));
      dispatch(triggerSuccessMsg(message));

      if (isEmailVerified) {
        dispatch(handleAuthClick(false));
      }
    },
    onError: (error: any) => {
      dispatch(triggerErrorMsg(`${error.response?.data?.message}`));
    },
    retry: 3,
  });

  const submitHandler: SubmitHandler<IAuth> = async (data) => {
    submitMutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="h-5/6 flex-1 flex items-center gap-2 justify-end"
    >
      <Input
        type="email"
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
        placeholder="Email"
        classProp={`placeholder:text-sm`}
        outerClassProp={`flex-1`}
      />
      <Input
        {...register("password")}
        type="password"
        error={!!errors.password}
        helperText={errors.password?.message}
        placeholder="Password / Create new password"
        classProp={`placeholder:text-sm`}
        outerClassProp={`flex-1`}
      />
      <Button
        authButtonType
        classProp={`${
          submitMutation.isPending ? "bg-custom-black" : "bg-custom-gray"
        } py-2 rounded-full  text-white font-bold px-3 hover:bg-custom-black`}
        type="submit"
      >
        {submitMutation.isPending ? "Authenticating..." : "Authenticate"}
      </Button>
    </form>
  );
};

export default AuthComponent;
