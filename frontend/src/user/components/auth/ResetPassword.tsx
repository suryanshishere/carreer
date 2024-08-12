import React, { useEffect } from "react";
import { useHttpClient } from "shared/utilComponents/hooks/http-hook";
import { Input } from "shared/utilComponents/form/input/Input";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { dataStatusUIAction } from "shared/utilComponents/store/dataStatus-ui-slice";

const ResetPassword: React.FC = () => {
  const { resetToken } = useParams<{ resetToken: string }>();
  const { sendRequest, error } = useHttpClient();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(dataStatusUIAction.setErrorHandler(error));
  }, [error, dispatch]);

  const resetPasswordHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = formData.get("confirm_new_password") as string;

    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BASE_URL}/users/auth/reset_password`,
        "POST",
        JSON.stringify({ resetToken, password }),
        { "Content-Type": "application/json" }
      );

      dispatch(dataStatusUIAction.setResMsg(response.data.message));
    } catch (err) {
      // Handle error
    }
  };

  if (resetToken?.length !== 30) return <div>NOT VALID RESET</div>;

  //password and input form validation left.

  return (
    <div className="w-30">
      <form onSubmit={resetPasswordHandler}>
        <Input name="new_password" type="password" required />
        // match both password validation
        <Input name="confirm_new_password" type="password" required />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
