import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Button from "shared/utilComponents/form/Button";
import { Input } from "shared/utilComponents/form/input/Input";
import { useHttpClient } from "shared/utilComponents/hooks/http-hook";
import useUserData from "shared/utilComponents/hooks/user-data-hook";
import { dataStatusUIAction } from "shared/utilComponents/store/data-status-ui";
import { AuthContext } from "shared/utilComponents/context/auth-context";
import { userDataHandler } from "shared/utilComponents/localStorageConfig/userDataHandler";

// Define form schema
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
  const { error, sendRequest } = useHttpClient();
  const { userId, token, email, isEmailVerified } = useUserData();
  const auth = useContext(AuthContext);
  const dispatch = useDispatch();
  const [checkOtp, setCheckOtp] = useState<boolean>(true);
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [verificationStatus, setVerificationStatus] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OTPFormInputs>({
    resolver: yupResolver(otpSchema),
    mode: "onSubmit",
  });

  useEffect(() => {
    dispatch(dataStatusUIAction.setErrorHandler(error));
  }, [error, dispatch]);

  useEffect(() => {
    // Countdown for resend OTP button
    if (!checkOtp) {
      setResendTimer(60);
    }
  }, [checkOtp]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  if (
    verificationStatus ||
    !userId ||
    !token ||
    !email ||
    isEmailVerified === "1"
  ) {
    return null;
  }

  const sendEmailHandler = async () => {
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BASE_URL}/user/auth/send_verification_email`,
        "POST",
        JSON.stringify({ userId, email }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      );
      dispatch(dataStatusUIAction.setResMsg(response.data.message as string));
      setCheckOtp(true);
    } catch (err) {
      // Handle error if needed
    }
  };

  const verifyOtpHandler: SubmitHandler<OTPFormInputs> = async ({
    email_verification_otp,
  }) => {
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BASE_URL}/user/auth/verify_email`,
        "POST",
        JSON.stringify({
          verificationToken: userId + email_verification_otp,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      dispatch(dataStatusUIAction.setResMsg(response.data.message as string));
      userDataHandler({ isEmailVerified: "1" });
      setVerificationStatus(true);
    } catch (err) {
      // Handle error if needed
    }
  };

  return (
    <form
      onSubmit={handleSubmit(verifyOtpHandler)}
      className="flex items-center gap-2 bg-custom-red"
    >
      Enter your OTP
      {/* <div className="w-40"> */}
      <Input
        {...register("email_verification_otp")}
        error={!!errors.email_verification_otp}
        helperText={errors.email_verification_otp?.message}
        type="number"
        placeholder="_ _ _ _ _ _"
        classProp="text-custom-black"
      />
      {/* </div> */}
      <Button type="submit">Verify OTP</Button>
      <Button
        type="button"
        onClick={sendEmailHandler}
        disabled={resendTimer > 0}
      >
        {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend"}
      </Button>
    </form>
  );
};

export default EmailVerification;
