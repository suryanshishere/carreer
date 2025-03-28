import React, { useContext, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Button from "shared/utils/form/Button";
import { Input } from "shared/utils/form/Input";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import {
  triggerErrorMsg,
  triggerSuccessMsg,
} from "shared/store/thunks/response-thunk";
import { handleAuthClick, updateUserData } from "shared/store/userSlice";
import axiosInstance from "shared/utils/api/axios-instance";

const otpSchema = Yup.object().shape({
  email_verification_otp: Yup.number()
    .required("OTP is required")
    .typeError("OTP must be a number")
    .test(
      "len",
      "OTP must be exactly 6 digits",
      (val) => val !== undefined && val.toString().length === 6
    )
    .test(
      "is-positive",
      "OTP must be a positive number",
      (val) => val !== undefined && val > 0
    ),
});

type OTPFormInputs = {
  email_verification_otp: number;
};

const EmailVerification = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const isOtpSent = useSelector((state: RootState) => state.user.isOtpSent);
  const [isSendOnce, setIsSendOnce] = useState<boolean>(isOtpSent);
  const dispatch = useDispatch<AppDispatch>();
  const [resendTimer, setResendTimer] = useState<number>(0);

  useEffect(() => {
    if (isOtpSent) {
      setResendTimer(60);
    }
  }, [isOtpSent]);

  useEffect(() => {
    if (resendTimer > 0) {
      const countdown = setInterval(
        () => setResendTimer((prev) => prev - 1),
        1000
      );
      return () => clearInterval(countdown);
    }
  }, [resendTimer]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OTPFormInputs>({
    resolver: yupResolver(otpSchema),
    mode: "onSubmit",
  });

  // Mutation for sending OTP email
  const sendOtpMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(
        `user/auth/send-verification-otp`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(triggerSuccessMsg(data.message, 10));
      if (!isSendOnce) {
        setIsSendOnce(true);
      }
      setResendTimer(60);
    },
    onError: (error: any) => {
      if (error.response.status === 429) {
        setResendTimer(error.response.data.extraData);
        setIsSendOnce(true);
      }
      dispatch(triggerErrorMsg(`${error.response?.data?.message}`));
    },
  });

  // Mutation for verifying OTP
  const verifyOtpMutation = useMutation({
    mutationFn: async (otp: number) => {
      const response = await axiosInstance.post(
        `user/auth/verify-email`,
        { otp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(updateUserData({ isEmailVerified: true }));
      dispatch(handleAuthClick(false));
      dispatch(triggerSuccessMsg(data.message));
      window.location.reload();
    },
    onError: (error: any) => {
      dispatch(triggerErrorMsg(`${error.response?.data?.message}`));
    },
  });

  const handleOtpEmail = () => {
    sendOtpMutation.mutate();
  };

  const verifyOtp: SubmitHandler<OTPFormInputs> = async ({
    email_verification_otp,
  }) => {
    verifyOtpMutation.mutate(email_verification_otp);
  };

  return (
    <form
      onSubmit={handleSubmit(verifyOtp)}
      className="h-full flex-1 flex flex-col mobile:flex-row mobile:items-center gap-3 justify-between "
    >
      <div className="flex-wrap self-center w-fit">
        {isSendOnce
          ? "Enter the OTP sent to your email for verification."
          : "Generate an OTP to verify your email."}
        <span className="text-custom_red">
          {/* {email &&
            `${email.slice(0, 3)}***${email.slice(email.indexOf("@") - 2)}`} */}
        </span>
      </div>

      {!isSendOnce ? (
        <Button
          authButtonType
          onClick={handleOtpEmail}
          disabled={sendOtpMutation.isPending}
          className={`${
            sendOtpMutation.isPending ? "bg-custom_black" : "bg-custom_gray"
          } self-center`}
        >
          {sendOtpMutation.isPending ? "Generating..." : "Generate OTP"}
        </Button>
      ) : (
        <>
          <Input
            {...register("email_verification_otp")}
            error={!!errors.email_verification_otp}
            helperText={errors.email_verification_otp?.message}
            type="number"
            className="py-2 text-md rounded placeholder:text-sm min-w-[6rem] flex-1 outline-custom_gray"
            placeholder="Enter OTP"
            outerClassProp="flex-1"
          />
          <div className="self-end flex gap-3">
            <Button
              authButtonType
              className={`${
                verifyOtpMutation.isPending
                  ? "bg-custom_black"
                  : "bg-custom_gray"
              } mobile:min-w-[6rem]`}
              type="submit"
              disabled={verifyOtpMutation.isPending}
            >
              {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
            </Button>
            <Button
              authButtonType
              className={`${
                sendOtpMutation.isPending
                  ? "bg-custom_black"
                  : resendTimer > 0
                  ? "bg-custom_less_gray"
                  : "bg-custom_gray"
              }`}
              onClick={handleOtpEmail}
              disabled={resendTimer > 0 || sendOtpMutation.isPending}
            >
              {sendOtpMutation.isPending
                ? "Resending..."
                : resendTimer > 0
                ? `Resend (${resendTimer}s)`
                : "Resend"}
            </Button>
          </div>
        </>
      )}
    </form>
  );
};

export default EmailVerification;
