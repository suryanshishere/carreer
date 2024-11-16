import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "shared/utils/form/Button";
import { Input, TextArea } from "shared/utils/form/input/Input";
import { AuthContext } from "shared/context/auth-context";
import { useHttpClient } from "shared/hooks/http-hook";
import useUserData from "shared/hooks/user-data-hook";

interface DeactivateProps {
  onMsg: (value: string) => void;
}

const Deactivate: React.FC<DeactivateProps> = ({ onMsg }) => {
  const [contentState, setContentState] = useState(false);
  const { error, sendRequest, isLoading } = useHttpClient();
  const { token, userId } = useUserData();
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const passwordValue = formData.get("password") as string;
    const reason = formData.get("reason_for_deactivate") as string;

    if (passwordValue.trim().length > 5) {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BASE_URL}/users/${userId}/deactivate`,
          "POST",
          JSON.stringify({
            password: passwordValue,
            reason: reason,
          }),
          {
            "Content-Type": "application/json",
            Authorization: "bearer " + token,
          }
        );
        const responseData = response.data as unknown as { message: string };
        onMsg(responseData.message);
        auth.logout();
        setTimeout(() => {
          navigate("/");
        }, 5000);
      } catch (err) {}
    }
  };

  if (!contentState) {
    const clickedHandler = () => {
      setContentState(true);
    };

    return (
      <div className="mt-2 w-full flex flex-col gap-2">
        <Button
          style={{ color: "var(--color-brown)" }}
          className="bg-transparent self-start"
          type="button"
          onClick={clickedHandler}
        >
          {" "}
          Deactivate Account{" "}
        </Button>
        <div>
          This will delete your account and can't be reactivated after 1 month
          of deactivated period.
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submitHandler}
      className="mt-2 mr-2 w-auto flex flex-col gap-2"
    >
      {/* {error && <Error error={error} />} */}
      <Input name="password" placeholder="Password" type="password" required />
      <TextArea
        className="h-50"
        name="reason_for_deactivate"
        placeholder="Reason for the deactivation (if any)"
      />
      <Button
        style={{ color: "var(--color-brown)" }}
        className="bg-transparent self-end"
      >
        {" "}
        Confirm Deactivate Account{" "}
      </Button>
    </form>
  );
};

export default Deactivate;
