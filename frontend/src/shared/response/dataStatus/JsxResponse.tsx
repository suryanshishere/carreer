import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHttpClient } from "shared/hooks/http-hook";
import useUserData from "shared/localStorageConfig/userData-hook";
import { RootState } from "shared/store";
import { dataStatusUIAction } from "shared/store/dataStatus-ui-slice";

const JsxResponse = () => {
  const { error, sendRequest } = useHttpClient();
  const { userId, token, email } = useUserData();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(dataStatusUIAction.setErrorHandler(error));
  }, [error, dispatch]);

  const sendEmailVerification = async () => {
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BASE_URL}/users/auth/send_verification_email`,
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
    } catch (err) {
      // Handle error if needed
    }
  };

  return (
    <div>
      <h2>Send email</h2>
      <button onClick={sendEmailVerification}>Click</button>
    </div>
  );
};

export default JsxResponse;
