import React, { useState } from "react";
import Box from "src/shared/components/uiElements/cover/Box";
import ACCOUNT_PROFILE from "src/db/account/AccountProfile.json";
import "./Profile.css";

const Profile = () => {
  const [contentState, setContentState] = useState<string>("");
  const [showMsg, setShowMsg] = useState<string>("");

  const msgHandler = (value: string) => {
    setShowMsg(value);
    setTimeout(() => {
      setShowMsg(""); // Clear the message after 5 seconds
    }, 5000);
  };

  const contentHandler = (uniqueHeader: string) => {
    setContentState(uniqueHeader);
  };

  let content;

  switch (contentState) {
    default:
      content = (
        <div className="setting_content_cover w-full h-full flex-1"></div>
      );
      break;
  }

  return (
    <Box className="setting_sec w-full flex ">
      <ul className="column1 h-full p-1 font-bold flex flex-col gap-1">
        {ACCOUNT_PROFILE.map((item, index) => (
          <React.Fragment key={index}>
            <li
              className={
                contentState === item.unique_header
                  ? "nav_li_active nav_li"
                  : "nav_li"
              }
              key={index}
              onClick={() => contentHandler(item.unique_header)}
            >
              {item.header}
            </li>
            {index !== Object.keys(ACCOUNT_PROFILE).length - 1 && <hr />}
          </React.Fragment>
        ))}
      </ul>
      {content && !showMsg && (
        <div className="flex-1 overflow-y-auto">{content}</div>
      )}
      {showMsg && <div className="setting_content_msg">{showMsg}</div>}
    </Box>
  );
};

export default Profile;
