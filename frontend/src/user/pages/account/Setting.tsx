import React, { useEffect, useState } from "react";
import Box from "shared/components/uiElements/cover/Box";
import ACCOUNT_SETTING from "db/account/AccountSetting.json";
import ChangePassword from "user/components/account/setting/ChangePassword";
import AccountInfo from "user/components/account/setting/AccountInfo";
import Deactivate from "user/components/account/setting/Deactivate";
import Para from "shared/components/uiElements/cover/Para";
import "./Setting.css";

const Setting = () => {
  const [settingState, setSettingState] = useState<string>("");
  const [contentState, setContentState] = useState<string>("");
  const [showMsg, setShowMsg] = useState<string>("");

  const msgHandler = (value: string) => {
    setShowMsg(value);
    setTimeout(() => {
      setShowMsg("");
    }, 10000);
  };

  const clickedHandler = (uniqueHeader: string) => {
    setSettingState(uniqueHeader);
  };

  const contentHandler = (uniqueHeader: string) => {
    setContentState(uniqueHeader);
  };

  let column2;

  const selectedItem = ACCOUNT_SETTING.find(
    (item) => item.unique_header === settingState
  );

  if (selectedItem && selectedItem.sub) {
    column2 = (
      <ul className="column1 h-full p-1 font-bold flex flex-col gap-1">
        {selectedItem.sub.map((subItem, index) => (
          <React.Fragment key={index}>
            <li
              className={
                contentState === subItem.unique_header
                  ? "nav_li_active nav_li p-2"
                  : "nav_li p-2"
              }
              key={index}
              onClick={() => contentHandler(subItem.unique_header)}
            >
              {subItem.header}
            </li>{" "}
            {index !== selectedItem.sub.length - 1 && <hr />}
          </React.Fragment>
        ))}
      </ul>
    );
  } else {
    column2 = null;
  }

  useEffect(() => {
    setContentState("");
  }, [settingState]);

  let content;

  switch (contentState) {
    case "ACCOUNT_INFORMATION":
      content = <AccountInfo />;
      break;
    case "CHANGE_YOUR_PASSWORD":
      content = <ChangePassword onMsg={msgHandler} />;
      break;
    case "DEACTIVATE_YOUR_ACCOUNT":
      content = <Deactivate onMsg={msgHandler} />;
      break;
    default:
      content = (
        <div className="setting_content_cover w-full h-full flex-1"></div>
      );
      break;
  }

  return (
    <Box className="setting_sec w-full flex ">
      <ul className="column1 h-full p-1 font-bold flex flex-col gap-1">
        {ACCOUNT_SETTING.map((item, index) => (
          <React.Fragment key={index}>
            <li
              className={
                settingState === item.unique_header
                  ? "nav_li_active nav_li p-2"
                  : "nav_li p-2"
              }
              key={index}
              onClick={() => clickedHandler(item.unique_header)}
            >
              {item.header}
            </li>
            {index !== ACCOUNT_SETTING.length - 1 && <hr />}
          </React.Fragment>
        ))}
      </ul>
      {column2}
      {content && !showMsg && (
        <div className="flex-1 overflow-y-auto">{content}</div>
      )}
      {showMsg && <Para paraMsg>{showMsg}</Para>}
    </Box>
  );
};

export default Setting;
