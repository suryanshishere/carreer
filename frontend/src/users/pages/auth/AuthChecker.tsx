import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleAuthClick, logout } from "shared/store/userSlice";
import { RootState } from "shared/store";
import Modal from "shared/ui/Modal";
import Button from "shared/utils/form/Button"; 
import { closeAllModal, toggleModalState } from "shared/store/modalSlice";

const AuthChecker: React.FC = () => {
  const isModalOpen = useSelector((state: RootState) => state.modal.modalStates["auth_session"]);
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
      dispatch(toggleModalState({ id: "auth_session", bool: true }));
    }
  }, [tokenExpiration]);

  const closeModalHandler = () => {
    dispatch(closeAllModal());
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
          <p className="text-center">
            Your session has expired. <br /> Please log in again to continue.
          </p> 
        </Modal>
      ) : null}
    </>
  );
};

export default AuthChecker;
