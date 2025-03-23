import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleAuthClick, logout } from "shared/store/userSlice";
import { RootState } from "shared/store";
import Modal from "shared/ui/Modal";
import Button from "shared/utils/form/Button";
import { openModal, closeModal } from "shared/store/modalSlice";

const AuthChecker: React.FC = () => {
  const isModalOpen = useSelector((state: RootState) => state.modal.isOpen);
  const tokenExpiration = useSelector(
    (state: RootState) => state.user.tokenExpiration
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (isModalOpen) {
      console.log("Modal should be open now");
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (!tokenExpiration) return;

    const expirationTime = new Date(tokenExpiration).getTime();
    const currentTime = Date.now();

    if (currentTime >= expirationTime) {
      dispatch(openModal());
    }
  }, [tokenExpiration]);

  const closeModalHandler = () => {
    dispatch(closeModal());
    dispatch(logout());
    dispatch(handleAuthClick(true));
  };

  return (
    <>
      {isModalOpen ? (
        <Modal
          header="Session Expired"
          footer={<Button onClick={closeModalHandler}>Close</Button>}
        >
          {/* <div className="flex flex-col items-center text-center"> */}
            <p>
              Your session has expired. <br /> Please log in again to continue.
            </p>
          {/* </div> */}
        </Modal>
      ) : null}
    </>
  );
};

export default AuthChecker;
