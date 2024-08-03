import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "shared/hooks/http-hook";
import { useDispatch } from "react-redux";
import { dataStatusUIAction } from "shared/store/dataStatus-ui-slice";
import useUserData from "shared/localStorageConfig/use-userData-hook";
import { userDataHandler } from "shared/localStorageConfig/userDataHandler";

const EmailVerification = () => {
  const { verificationToken } = useParams();
  const { sendRequest, error } = useHttpClient();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(dataStatusUIAction.setErrorHandler(error));
  }, [error, dispatch]);

  useEffect(() => {
    const fetchVerification = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BASE_URL}/users/auth/verify_email`,
          "POST",
          JSON.stringify({
            verificationToken: verificationToken,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        dispatch(dataStatusUIAction.setResMsg(response.data.message as string));
        userDataHandler({ emailVerified: "0" });
      } catch (err) {
        // Handle error if needed
      }
    };
    if (verificationToken) {
      fetchVerification();
    }
  }, []);

  return <div>EmailVerification</div>;
};

export default EmailVerification;
