import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "shared/store/userSlice";
import { RootState } from "shared/store";
import Modal from "shared/ui/Modal";

const AuthChecker: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tokenExpiration = useSelector(
    (state: RootState) => state.user.tokenExpiration
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!tokenExpiration) return;

    const expirationTime = new Date(tokenExpiration).getTime();
    const currentTime = Date.now();

    if (currentTime >= expirationTime) {
      // Token has expired: log out user and show modal.
      dispatch(logout());
      setIsModalOpen(true);
    }
  }, [tokenExpiration, dispatch]);

  const closeModal = () => {
    setIsModalOpen(false);
    // Optionally, navigate to the login page or perform additional actions.
  };

  return (
    <>
      {isModalOpen && (
        <Modal header="Session Expired" onClose={true}>
          <div className="flex flex-col items-center">
            <p>Your session has expired. Please log in again to continue.</p>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default AuthChecker;
