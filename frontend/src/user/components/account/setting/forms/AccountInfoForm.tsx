import React, { useEffect, useState } from "react";
import { AccountInfoData } from "../AccountInfo";
import EditIcon from "@mui/icons-material/Edit";
import Button from "shared/utilComponents/form/Button";
import { useHttpClient } from "shared/utilComponents/hooks/http-hook";
import { useDispatch } from "react-redux";
import { dataStatusUIAction } from "shared/utilComponents/store/dataStatus-ui-slice";
import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";
import { formatWord } from "shared/uiComponents/uiUtilComponents/format-word";
import useUserData from "shared/utilComponents/localStorageConfig/use-userData-hook";

interface AccountInfoFormProps {
  accountInfoData: AccountInfoData;
}

const AccountInfoForm: React.FC<AccountInfoFormProps> = ({
  accountInfoData,
}) => {
  const [accountInfo, setAccountInfo] =
    useState<AccountInfoData>(accountInfoData);
  const [editState, setEditState] = useState<string>("");
  const { error,  sendRequest, clearError } = useHttpClient();
  const { token, userId } = useUserData();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(dataStatusUIAction.setErrorHandler(error));
  }, [error,  clearError, dispatch]);

  const editHandler = (value: string) => {
    setEditState(value);
  };

  const submitHandler = async (
    e: React.FormEvent<HTMLFormElement>,
    header: string
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    let newValue = (formData.get(header.toLowerCase()) as string).trim();

    if (header.toLowerCase() === "username") {
      newValue = newValue.replace(/\s+/g, "");
    }

    const oldValue = accountInfo[header as keyof AccountInfoData] || "";

    if (newValue === oldValue) {
      setEditState("");
      return;
    }

    const formattedHeader = header.toLowerCase().replace(/\s+/g, "_");
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BASE_URL}/users/${userId}/account-info`,
        "PATCH",
        JSON.stringify({
          field: formattedHeader,
          value: newValue,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "bearer " + token,
        }
      );
      const responseData = response.data;
      dispatch(dataStatusUIAction.setResMsg(responseData.message));

      const updatedAccountInfo = {
        ...accountInfoData,
        [formattedHeader]: newValue,
      };

      setAccountInfo(updatedAccountInfo);
      setEditState("");
    } catch (err) {}
  };

  const getInputType = (header: string): string => {
    switch (header.toLowerCase()) {
      case "email":
        return "email";
      case "phone":
        return "tel";
      case "birth date":
        return "date";
      default:
        return "text";
    }
  };

  return (
    <>
      {Object.entries(accountInfo).map(([header, data], index) => (
        <React.Fragment key={index}>
          <form
            className="w-auto flex justify-between items-center gap-2 mr-6"
            onSubmit={(e) => submitHandler(e, header as keyof AccountInfoData)}
          >
            <li className="account_info_li grow overflow-hidden list-none flex flex-col justify-center gap-1 pl-4">
              <span className="capitalize font-bold ">{formatWord(header)}</span>
              {editState === header ? (
                <div className="w-full flex justify-between mr-6">
                  <input
                    className="account_info_edit w-full h-8 pl-2 font-bold"
                    defaultValue={data ? data : ""}
                    name={header}
                    type={getInputType(header as keyof AccountInfoData)}
                    required={
                      header.toLowerCase() === "email" ||
                      header.toLowerCase() === "username"
                    }
                  />
                </div>
              ) : (
                <span>
                  {data
                    ? header === "username"
                      ? `@${data}`
                      : (data)
                    : "NA, add it!"}
                </span>
              )}
            </li>
            {editState !== header ? (
              <IconButton size="small" onClick={() => editHandler(header)}>
                {data && data.length !== 0 ? <EditIcon /> : <AddIcon />}
              </IconButton>
            ) : (
              <Button type="submit" size="small" className="mr-6 mt-4" tick />
            )}
          </form>
          {index !== Object.keys(accountInfoData).length - 1 && <hr />}
        </React.Fragment>
      ))}
    </>
  );
};

export default AccountInfoForm;
