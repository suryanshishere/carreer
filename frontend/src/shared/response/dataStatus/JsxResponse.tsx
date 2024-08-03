import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHttpClient } from "shared/hooks/http-hook";
import useUserData from "shared/localStorageConfig/use-userData-hook";
import { RootState } from "shared/store";
import { dataStatusUIAction } from "shared/store/dataStatus-ui-slice";

const JsxResponse = () => {
  
  return (
    <div>
      <h2>Send email</h2>
      <button >Click</button>
    </div>
  );
};

export default JsxResponse;
