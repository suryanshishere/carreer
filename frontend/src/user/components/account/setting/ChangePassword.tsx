import React from "react";
import { useHttpClient } from "shared/hooks/http-hook";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import "./ChangePassword.css";

interface ChangePasswordProps {
  onMsg: (msg: string) => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ onMsg }) => {
  const { sendRequest } = useHttpClient();
  const { token, userId } = useSelector(
    (state: RootState) => state.auth.userData
  );

  const authSubmitHandler = async () => {
    // if (
    //   formState.password.value.trim() !== "" &&
    //   formState.password.value === formState.newPassword?.value
    // ) {
    //   return dispatch(
    //     dataStatusUIAction.setErrorHandler("Password seem exactly same")
    //   );
    // }
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BASE_URL}/users/change-password`,
        "POST",
        JSON.stringify({
          // email: formState.email.value,
          // password: formState.password.value,
          // newPassword: formState.newPassword?.value,
        }),
        {
          Authorization: "bearer " + token,
          "Content-Type": "application/json",
        }
      );

      const responseData = response.data as unknown as { message: string };

      onMsg(responseData.message);
    } catch (err) {}
  };

  return (
    <div className="w-full mt-4">
      {/* <Form onFormSubmit={authSubmitHandler} changePassword /> */}
    </div>
  );
};

export default ChangePassword;
