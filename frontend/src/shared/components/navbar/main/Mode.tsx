import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "shared/utils/api/axios-instance";
import {
  triggerErrorMsg,
  triggerSuccessMsg,
} from "shared/store/thunks/response-thunk";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import { updateMode } from "shared/store/user_slice";
import Modal from "shared/ui/Modal";
import Tooltip from "@mui/material/Tooltip";
import Button from "shared/utils/form/Button";
import { openModal, closeModal } from "shared/store/modal-slice";
import { USER_ACCOUNT_MODE_DB } from "user/user-db";

const Mode: React.FC = () => {
  const mode = useSelector((state: RootState) => state.user.mode);
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
      const { message } = data;
      dispatch(updateMode({ max: isChecked }));
      dispatch(triggerSuccessMsg(message || "Max mode updated!"));
    },
    onError: (error: any) => {
      dispatch(
        triggerErrorMsg(
          error.response?.data?.message || "Mode not updated, try again!"
        )
      );
      // Revert checkbox state on error
      setIsChecked((prev) => !prev);
    },
  });

  const handleCheckboxChange = () => {
    const newState = !isChecked;
    // When turning off max mode, show confirmation modal via dispatch
    if (isChecked && !newState) {
      dispatch(openModal());
    } else {
      // When turning on max mode, update directly
      setIsChecked(newState);
      mutation.mutate(newState);
    }
  };

  // Called when user confirms turning off max mode
  const handleConfirm = () => {
    setIsChecked(false);
    mutation.mutate(false);
    dispatch(closeModal());
  };

  // Called when user cancels the change
  const handleCancel = () => {
    dispatch(closeModal());
  };

  // Use Redux state to check if the modal is open
  const isModalOpen = useSelector((state: RootState) => state.modal.isOpen);

  return (
    <div>
      <Tooltip title="Max Mode: Instant access to information" arrow>
        <label className="relative w-14 flex cursor-pointer select-none items-center">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="sr-only"
          />
          <div
            className={`h-6 w-full rounded-full transition text-xs font-bold flex items-center justify-center text-custom_black whitespace-nowrap ${
              isChecked ? "bg-custom_less_blue" : "bg-custom_less_gray"
            }`}
          >
            {!isChecked && <span className="ml-5 pr-1">MAX</span>}
          </div>
          <div
            className={`dot absolute top-[4px] mx-1 h-4 w-4 rounded-full transition-transform ${
              isChecked
                ? "translate-x-8 bg-custom_blue"
                : "translate-x-0 bg-custom_gray"
            }`}
          ></div>
        </label>
      </Tooltip>
      {isModalOpen && (
        <Modal
          onClose
          header="Mode Change Confirmation"
          footer={
            <div className="flex justify-end gap-2">
              <Button onClick={handleCancel}>Cancel</Button>
              <Button authButtonType onClick={handleConfirm}>
                Confirm
              </Button>
            </div>
          }
        >
          {USER_ACCOUNT_MODE_DB.max_mode_off_confirm}
        </Modal>
      )}
    </div>
  );
};

export default Mode;
