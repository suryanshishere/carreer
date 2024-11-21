import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import {
  triggerErrorMsg,
  triggerSuccessMsg,
} from "shared/store/thunks/response-thunk";
import { useLocation } from "react-router-dom";
import AuthForm from "user/components/auth/AuthForm";
import { AuthProps } from "user/pages/auth/Auth";

const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

interface IForgotPassword {
  email: string;
}

const ForgotPassword: React.FC<AuthProps> = ({ onBack, classProp }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useSelector((state: RootState) => state.auth.userData);
  const [reached, setReached] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForgotPassword>({
    resolver: yupResolver(validationSchema),
    mode: "onSubmit",
  });
  const location = useLocation();

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
      dispatch(triggerSuccessMsg(data.message));
      if (onBack) {
        onBack();
      }
      setReached(true);
    },
    onError: (error: any) => {
      dispatch(triggerErrorMsg(`${error.response?.data?.message}`));
    },
  });

  const submitHandler: SubmitHandler<IForgotPassword> = async (data) => {
    submitMutation.mutate(data);
  };

  // Reset `reached` after 5 seconds
  useEffect(() => {
    if (reached) {
      const timer = setTimeout(() => setReached(false), 5000);
      return () => clearTimeout(timer); // Cleanup timer on unmount or dependency change
    }
  }, [reached]);

  if (reached) {
    return (
      <p className="text-base text-center text-custom-green p-button font-bold">
        Reset password link sent successfully!
      </p>
    );
  }

  const isForgotPassword = location.pathname === "/user/forgot-password";

  const formContent = (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className={
        isForgotPassword ? "w-1/2 flex flex-col gap-2" : `${classProp}`
      }
    >
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
        } py-2 rounded-full text-white font-bold px-3 hover:bg-custom-black`}
      />
    </form>
  );

  return isForgotPassword ? (
    <div className="w-full flex justify-center">{formContent}</div>
  ) : (
    formContent
  );
};

export default ForgotPassword;
