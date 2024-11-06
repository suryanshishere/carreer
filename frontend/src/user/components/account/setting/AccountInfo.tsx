import React, { useEffect, useState } from "react";
import { useHttpClient } from "shared/utilComponents/hooks/http-hook";
import { Input } from "shared/utilComponents/form/input/Input";
import Button from "shared/utilComponents/form/Button";
import Para from "shared/uiComponents/cover/Para";
import "./AccountInfo.css";
import { dataStatusUIAction } from "shared/utilComponents/store/data-status-ui";
import { useDispatch } from "react-redux";
import AccountInfoForm from "./forms/AccountInfoForm";
import useUserData from "shared/utilComponents/hooks/user-data-hook";

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
  const { sendRequest, error,  clearError } = useHttpClient();
  const { token, userId } = useUserData();
  const [contentState, setContentState] = useState(false);
  const [responseData, setResponseData] = useState<AccountInfoData>(
    () => ({} as AccountInfoData)
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(dataStatusUIAction.setErrorHandler(error));
  }, [error,   dispatch]);

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
            type="password"
            required
          />
          <Button type="submit" />
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
