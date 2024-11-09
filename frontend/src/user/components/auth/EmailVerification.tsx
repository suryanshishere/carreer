import React, { useContext, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Button from "shared/utilComponents/form/Button";
import { Input } from "shared/utilComponents/form/input/Input";
import { useMutation } from "@tanstack/react-query"; // Import useMutation
import useUserData from "shared/utilComponents/hooks/user-data-hook";
import { AuthContext } from "shared/utilComponents/context/auth-context";
import { userDataHandler } from "shared/utilComponents/localStorageConfig/userDataHandler";
import axios from "axios"; // Make sure axios is imported
import { ResponseContext } from "shared/utilComponents/context/response-context";

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
  const { userId, token, email, isEmailVerified } = useUserData();
  const auth = useContext(AuthContext);
  const [isSendOnce, setIsSendOnce] = useState<boolean>(auth.isOtpSend);
  const response = useContext(ResponseContext);
  const [resendTimer, setResendTimer] = useState<number>(0);

  useEffect(() => {
    if (auth.isOtpSend) {
      setResendTimer(60);
    }
  }, [auth.isOtpSend]);

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
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/user/auth/send_verification_otp`,
        {},
        {
          headers: {
            userid: userId,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      response.setSuccessMsg(data.message);
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
      response.setErrorMsg(`${error.response?.data?.message}`);
    },
  });

  // Mutation for verifying OTP
  const verifyOtpMutation = useMutation({
    mutationFn: async (otp: number) => {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/user/auth/verify_email`,
        { otp },
        {
          headers: {
            "Content-Type": "application/json",
            userid: userId,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      response.setSuccessMsg(data.message);
      userDataHandler({ isEmailVerified: "1" });
      auth.authClickedHandler(false);
    },
    onError: (error: any) => {
      response.setErrorMsg(`${error.response?.data?.message}`);
    },
  });

  if (isEmailVerified) {
    return null;
  }

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
      className="h-5/6 flex-1 flex items-center gap-2 justify-between "
    >
      <div className="flex-wrap w-fit">
        {isSendOnce
          ? "Enter your OTP for verification, which was sent to your email "
          : "Generate OTP for verification on your email "}
        <span className="text-custom-red">
          {email &&
            `${email.slice(0, 3)}***${email.slice(email.indexOf("@") - 2)}`}
        </span>
      </div>

      {!isSendOnce ? (
        <Button
          classProp={`py-2 px-3 font-bold rounded-full  text-custom-white ${
            sendOtpMutation.isPending
              ? "bg-custom-black"
              : "bg-custom-grey hover:bg-custom-black"
          }`}
          onClick={handleOtpEmail}
          disabled={sendOtpMutation.isPending}
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
            classProp="py-2 text-md rounded placeholder:text-sm min-w-[6rem] flex-1"
            placeholder="Enter OTP"
            outerClassProp="flex-1"
          />
          <Button
            classProp={`${
              verifyOtpMutation.isPending
                ? "bg-custom-black"
                : "hover:bg-custom-black bg-custom-grey"
            } py-2 rounded-full  text-white px-3  font-bold`}
            type="submit"
            disabled={verifyOtpMutation.isPending}
          >
            {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
          </Button>
        </>
      )}
      {isSendOnce && (
        <Button
          classProp={`${
            sendOtpMutation.isPending
              ? "bg-custom-black"
              : resendTimer > 0
              ? "bg-custom-hover-faint"
              : "bg-custom-grey hover:bg-custom-black"
          } ml-2 py-2 rounded-full text-white px-3 font-bold`}
          onClick={handleOtpEmail}
          disabled={resendTimer > 0 || sendOtpMutation.isPending}
        >
          {sendOtpMutation.isPending
            ? "Resending..."
            : resendTimer > 0
            ? `Resend (${resendTimer}s)`
            : "Resend"}
        </Button>
      )}
    </form>
  );
};

export default EmailVerification;
