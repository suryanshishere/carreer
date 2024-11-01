import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Button from "shared/utilComponents/form/Button";
import { Input } from "shared/utilComponents/form/input/Input";
import { useMutation } from "@tanstack/react-query"; // Import useMutation
import useUserData from "shared/utilComponents/hooks/user-data-hook";
import { dataStatusUIAction } from "shared/utilComponents/store/data-status-ui";
import { AuthContext } from "shared/utilComponents/context/auth-context";
import { userDataHandler } from "shared/utilComponents/localStorageConfig/userDataHandler";
import axios from "axios"; // Make sure axios is imported

const otpSchema = Yup.object().shape({
  email_verification_otp: Yup.string()
    .required("OTP is required")
    .length(6, "OTP must be exactly 6 digits")
    .matches(/^\d+$/, "OTP must only contain numbers"),
});

type OTPFormInputs = {
  email_verification_otp: string;
};

const EmailVerification = () => {
  const { userId, token, email, isEmailVerified } = useUserData();

  const auth = useContext(AuthContext);
  const [isSendOnce, setIsSendOnce] = useState<boolean>(auth.isOtpSend);
  const dispatch = useDispatch();
  const [resendTimer, setResendTimer] = useState(0);
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
  });

  // Mutation for sending OTP email
  const sendOtpMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/user/auth/send_verification_email`,
        JSON.stringify({ userId }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(dataStatusUIAction.setResMsg(data.message));
      if (!isSendOnce) {
        setIsSendOnce(true);
      }
      setResendTimer(60);
    },
    onError: (error: any) => {
      dispatch(
        dataStatusUIAction.setErrorHandler(`${error.response?.data?.message}`)
      );
    },
  });

  // Mutation for verifying OTP
  const verifyOtpMutation = useMutation({
    mutationFn: async (otp: string) => {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/user/auth/verify_email`,
        JSON.stringify({
          verificationToken: userId + otp,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(dataStatusUIAction.setResMsg(data.message));
      userDataHandler({ isEmailVerified: "1" });
      auth.authClickedHandler(false);
    },
    onError: (error: any) => {
      dispatch(
        dataStatusUIAction.setErrorHandler(`${error.response?.data?.message}`)
      );
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
    <>
      <form
        onSubmit={handleSubmit(verifyOtp)}
        className="h-5/6 flex-1 flex items-center gap-2 justify-between"
      >
        <div className="flex-wrap w-fit">
          {!(!isSendOnce && !auth.isOtpSend)
            ? "Enter your OTP for verification, which was sent to your email "
            : "Generate OTP for verification on your email "}
          <span className="text-custom-red">{email}</span>
        </div>

        {!isSendOnce && !auth.isOtpSend ? (
          <Button
            classProp="py-2 px-3 rounded-full bg-custom-grey text-white font-bold  hover:bg-custom-black hover:text-custom-white hover:border-custom-black"
            onClick={handleOtpEmail}
            disabled={sendOtpMutation.isPending} // Disable button if sending OTP is in progress
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
              classProp="py-2 rounded-full bg-custom-grey text-white font-bold px-3 hover:bg-custom-black hover:text-custom-white hover:border-custom-black"
              type="submit"
              disabled={verifyOtpMutation.isPending} // Disable button if verifying OTP is in progress
            >
              {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
            </Button>
          </>
        )}
        {isSendOnce && (
          <Button
            classProp={`${
              resendTimer > 0
                ? "bg-custom-hover-faint"
                : "bg-custom-grey hover:bg-custom-black"
            } ml-2 py-2 rounded-full text-white font-bold px-3`}
            onClick={handleOtpEmail}
            disabled={resendTimer > 0 || sendOtpMutation.isPending} // Disable if resend timer is active or OTP sending is in progress
          >
            {sendOtpMutation.isPending
              ? "Resending..."
              : resendTimer > 0
              ? `Resend (${resendTimer}s)`
              : "Resend"}
          </Button>
        )}
      </form>
      <div className="flex flex-col items-end text-xs w-auto">
        <Button
          style={{ cursor: "default" }}
          classProp="hover:text-custom-less-red p-0 m-0"
        >
          Need help?
        </Button>
        <Button
          style={{ cursor: "default" }}
          classProp=" hover:text-custom-less-red p-0 m-0 ml-auto"
          onClick={() => auth.logout()}
        >
          Logout
        </Button>
      </div>
    </>
  );
};

export default EmailVerification;
