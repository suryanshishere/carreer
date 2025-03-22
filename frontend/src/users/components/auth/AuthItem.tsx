import React from "react";
import { AuthProps } from "users/pages/auth/Auth";
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
import { login } from "shared/store/userSlice";
import axiosInstance from "shared/utils/api/axios-instance";
import { Input } from "shared/utils/form/Input";
import Button from "shared/utils/form/Button";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

// Validation schema using Yup for the email/password form
const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

// This is the form data for email/password login
interface IAuthForm {
  email: string;
  password: string;
}

// Define the mutation input type as a union so it can also accept a Google token
type AuthMutationInput = IAuthForm | { googleToken: string };

const AuthComponent: React.FC<AuthProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAuthForm>({
    resolver: yupResolver(validationSchema),
    mode: "onSubmit",
  });

  // Mutation to send auth data (email/password or googleToken)
  const submitMutation = useMutation({
    mutationFn: async (data: AuthMutationInput) => {
      const response = await axiosInstance.post(
        `/user/auth`,
        JSON.stringify(data)
      );
      return response.data;
    },
    onSuccess: ({
      token,
      tokenExpiration,
      isEmailVerified,
      role,
      mode,
      message,
    }) => {
      dispatch(triggerSuccessMsg(message));
      dispatch(login({ token, tokenExpiration, isEmailVerified, role, mode }));
    },
    onError: (error: any) => {
      dispatch(triggerErrorMsg(`${error.response?.data?.message}`));
    },
    retry: 3,
  });

  const submitHandler: SubmitHandler<IAuthForm> = async (data) => {
    submitMutation.mutate(data);
  };

  // Handler for Google Login success
  const handleGoogleSuccess = (credentialResponse: any) => {
    if (credentialResponse.credential) {
      // Now TypeScript accepts this because it matches { googleToken: string }
      submitMutation.mutate({ googleToken: credentialResponse.credential });
    }
  };

  // Handler for Google Login failure
  const handleGoogleFailure = () => {
    dispatch(triggerErrorMsg("Google authentication failed."));
  };

  return (
    <GoogleOAuthProvider
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID as string}
    >
      <form
        className="flex-1 flex flex-col large_mobile:flex-row large_mobile:items-center gap-2 justify-end"
        onSubmit={handleSubmit(submitHandler)}
      >
        <Input
          type="email"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          placeholder="Email"
          className="placeholder:text-sm outline-custom_gray"
          outerClassProp="flex-1"
        />
        <Input
          {...register("password")}
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message}
          placeholder="Password / Create new password"
          className="placeholder:text-sm outline-custom_gray"
          outerClassProp="flex-1"
        />
        <div className="flex items-center gap-2">
          <Button
            authButtonType
            disabled={submitMutation.isPending}
            type="submit"
            className="w-full"
          >
            {submitMutation.isPending ? "Authenticating..." : "Authenticate"}
          </Button>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            // type="icon"
            shape="circle"
          />
        </div>
      </form>
    </GoogleOAuthProvider>
  );
};

export default AuthComponent;
