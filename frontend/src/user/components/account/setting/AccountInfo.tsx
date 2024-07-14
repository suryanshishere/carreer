import React, { useEffect, useState } from "react";
import { useHttpClient } from "shared/hooks/http-hook";
import  useAuth  from "shared/hooks/auth-hook";
import { Input } from "shared/components/form/input/Input";
import Button from "shared/components/form/Button";
import Para from "shared/components/uiElements/cover/Para";
import Loading from "shared/components/uiElements/common/response/Loading";
import Error from "shared/components/uiElements/common/response/Response&Error";
import AccountInfoForm from "./forms/AccountInfoForm";
import "./AccountInfo.css";
import { responseUIAction } from "shared/store/reponse-ui-slice";
import { useDispatch } from "react-redux";

export interface AccountInfoData {
  username: string;
  email: string;
  phone: string;
  country: string;
  language: string;
  gender: string;
  birth_day: string | null;
  tag: any[];
}

const AccountInfo = () => {
  const { sendRequest, error, isLoading, clearError } = useHttpClient();
  const { userId, token } = useAuth();
  const [contentState, setContentState] = useState(false);
  const [responseData, setResponseData] = useState<AccountInfoData>(
    () => ({} as AccountInfoData)
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(responseUIAction.setErrorHandler(error));
    dispatch(responseUIAction.isLoadingHandler(isLoading));
  }, [error, isLoading, clearError, dispatch]);

  const passwordSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const passwordValue = formData.get("password") as string;

    if (passwordValue.trim().length > 5) {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BASE_URL}/users/${userId}/account-info`,
          "POST",
          JSON.stringify({
            password: passwordValue,
          }),
          {
            "Content-Type": "application/json",
            Authorization: "bearer " + token,
          }
        );
        const responseData = response.data as unknown as AccountInfoData;
        setResponseData(responseData);
        setContentState(true);
      } catch (err) {}
    }
  };

  if (!contentState) {
    return (
      <div className="account_info_start flex flex-col mt-4">
        <form
          className="flex items-center mr-4 gap-1"
          onSubmit={passwordSubmitHandler}
        >
          <Input
            name="password"
            placeholder="Your password"
            togglePassword
            required
          />
          <Button  type="submit" tick />
        </form>
        <Para>Verify first, in-order to get access to your account info.</Para>
      </div>
    );
  }

  return (
    <ul className="account_info flex flex-col w-full p-0 font-bold">
      {!Object.keys(responseData).length && <div>Loading...</div>}
      <AccountInfoForm accountInfoData={responseData} />
    </ul>
  );
};

export default AccountInfo;
