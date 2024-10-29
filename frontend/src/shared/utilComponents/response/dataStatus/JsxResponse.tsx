import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHttpClient } from "shared/utilComponents/hooks/http-hook";
import useUserData from "shared/utilComponents/hooks/user-data-hook";
import { RootState } from "shared/utilComponents/store";
import { dataStatusUIAction } from "shared/utilComponents/store/data-status-ui";

const JsxResponse = () => {
  
  return (
    <div>
      <h2>Send email</h2>
      <button >Click</button>
    </div>
  );
};

export default JsxResponse;
