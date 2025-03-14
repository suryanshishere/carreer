import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "shared/utils/api/axios-instance";
import {
  triggerErrorMsg,
  triggerSuccessMsg,
} from "shared/store/thunks/response-thunk";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import { updateMode } from "shared/store/userSlice";
import Modal from "shared/ui/Modal";
import Button from "shared/utils/form/Button";
import { openModal, closeModal } from "shared/store/modalSlice";
import { USER_ACCOUNT_MODE_DB } from "users/db";
import Toggle from "shared/utils/form/Toggle";

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
      setIsChecked((prev) => !prev);
    },
  });

  const handleCheckboxChange = () => {
    const newState = !isChecked;
    if (isChecked && !newState) {
      dispatch(openModal());
    } else {
      setIsChecked(newState);
      mutation.mutate(newState);
    }
  };

  const handleConfirm = () => {
    setIsChecked(false);
    mutation.mutate(false);
    dispatch(closeModal());
  };

  const handleCancel = () => {
    dispatch(closeModal());
  };

  const isModalOpen = useSelector((state: RootState) => state.modal.isOpen);

  return (
    <div>
      <Toggle
        checked={isChecked}
        onChange={handleCheckboxChange}
        tooltip="Max Mode: Instant access to information"
        labelClassName="w-14"
        label="Max"
        dotActiveClassName="translate-x-8"
      />
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
