import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Button from "shared/utilComponents/form/Button";
import { Input } from "shared/utilComponents/form/input/Input";
import { useHttpClient } from "shared/utilComponents/hooks/http-hook";
import useUserData from "shared/utilComponents/localStorageConfig/use-userData-hook";
import { userDataHandler } from "shared/utilComponents/localStorageConfig/userDataHandler";
import { dataStatusUIAction } from "shared/utilComponents/store/data-status-ui";

const SendEmailVerification = () => {
  const { error, sendRequest } = useHttpClient();
  const { userId, token, email, emailVerified } = useUserData();
  const dispatch = useDispatch();
  const [checkOtp, setCheckOtp] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(0);
  const [verificationStatus, setVerificationStatus] = useState<boolean>(false);

  useEffect(() => {
    dispatch(dataStatusUIAction.setErrorHandler(error));
  }, [error, dispatch]);

  useEffect(() => {
    if (!checkOtp) {
      setResendTimer(60);
    }
  }, [checkOtp]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [resendTimer]);

  if (
    verificationStatus ||
    !userId ||
    !token ||
    !email ||
    emailVerified === "1"
  ) {
    return null;
  }

  const sendEmailHandler = async () => {
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BASE_URL}/user/auth/send_verification_email`,
        "POST",
        JSON.stringify({
          userId: userId,
          email: email,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        }
      );

      dispatch(dataStatusUIAction.setResMsg(response.data.message as string));
      setCheckOtp(true);
    } catch (err) {
      // Handle error if needed
    }
  };

  const verifyOtpHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const otp = formData.get("email_verification_otp") as string;

    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BASE_URL}/user/auth/verify_email`,
        "POST",
        JSON.stringify({
          verificationToken: userId + otp,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      dispatch(dataStatusUIAction.setResMsg(response.data.message as string));
      userDataHandler({ emailVerified: "1" });
      setVerificationStatus(true);
    } catch (err) {
      // Handle error if needed
    }
  };

  return (
    <div
      className="fixed w-full h-40 bottom-0 flex justify-center items-center gap-2"
      style={{
        backgroundColor: "var(--color-red)",
        color: "var(--color-white)",
      }}
    >
      {!checkOtp ? (
        <>
          Verify your email <strong>{email}</strong>,{" "}
          <Button onClick={sendEmailHandler}>Send</Button> a OTP!
        </>
      ) : (
        <form onSubmit={verifyOtpHandler} className="flex items-center gap-2">
          Enter your OTP{" "}
          <div className="w-40">
            <Input
              name="email_verification_otp"
              type="number"
              required
              placeholder="_ _ _ _ _ _"
            />
          </div>
          <Button type="submit">Verify OTP</Button>
          <Button onClick={sendEmailHandler} disabled={resendTimer > 0}>
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default SendEmailVerification;
