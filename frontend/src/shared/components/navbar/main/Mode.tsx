import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "shared/utils/api/axios-instance";
import {
  triggerErrorMsg,
  triggerSuccessMsg,
} from "shared/store/thunks/response-thunk";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import { updateUserData } from "shared/store/auth-slice";
import { IUserAccountMode } from "models/userModel/IUserData";

const Mode = () => {
  const mode = useSelector((state: RootState) => state.auth.userData.mode);
  const [isChecked, setIsChecked] = useState(mode?.max || false);
  const dispatch = useDispatch<AppDispatch>();

  const mutation = useMutation({
    mutationFn: async (modeState: boolean) => {
      const response = await axiosInstance.post("/user/account/mode", {
        mode: { max: modeState },
      });
      return response.data;
    },
    onSuccess: (data) => {
      // On success, you now get the response data
      const { message } = data;
      dispatch(updateUserData({ mode: { max: isChecked } }));
      dispatch(triggerSuccessMsg(message || "Max mode updated!"));
    },
    onError: (error: any) => {
      dispatch(
        triggerErrorMsg(
          `${error.response?.data?.message}` || "Mode not updated, try again!"
        )
      );
      // Revert the checkbox state in case of error
      setIsChecked(!isChecked);
    },
  });

  const handleCheckboxChange = () => {
    const newState = !isChecked;
    setIsChecked(newState);
    mutation.mutate(newState); // Pass the updated state to the mutation
  };

  return (
    <div>
      <label className="relative w-14 flex cursor-pointer select-none items-center">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="sr-only"
        />
        <div
          className={`h-6 w-full rounded-full transition text-xs font-bold flex items-center justify-center text-custom-black whitespace-nowrap ${
            isChecked ? "bg-custom-less-blue" : "bg-custom-less-gray"
          }`}
        >
          {!isChecked && <span className="ml-5 pr-1">MAX</span>}
        </div>
        <div
          className={`dot absolute top-[4px] mx-1 h-4 w-4 rounded-full transition-transform ${
            isChecked
              ? "translate-x-8 bg-custom-blue"
              : "translate-x-0 bg-custom-gray"
          }`}
        ></div>
      </label>
    </div>
  );
};

export default Mode;
