import React, { useContext, useEffect, useState } from "react";
import Button from "shared/utilComponents/form/Button";
import Loading from "shared/utilComponents/api/response/dataStatus/Loading";
import Modal from "shared/uiComponents/modal/Modal";
import { AuthContext } from "shared/utilComponents/context/auth-context";
import { useHttpClient } from "shared/utilComponents/hooks/http-hook";
import { useDispatch } from "react-redux";
import useUserData from "shared/utilComponents/hooks/user-data-hook";

const ActivateModal = () => {
  const { token, userId } = useUserData();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [resMsg, setResponseMsg] = useState("");
  const [showModal, setShowModal] = useState(false);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (userId) {
  //       try {
  //         const response = await sendRequest(
  //           `${process.env.REACT_APP_BASE_URL}/users/${userId}/deactivate-at`,
  //           "GET",
  //           null,
  //           {
  //             "Content-Type": "application/json",
  //             Authorization: "bearer " + token,
  //           }
  //         );

  //         const responseData = response.data as unknown as { message: string };
  //         setResponseMsg(responseData.message);
  //         setShowModal(true);
  //       } catch (error) {}
  //     }
  //   };

  //   fetchData();
  // }, [sendRequest, userId, token]);

  const noHandler = () => {
    auth.logout();
    setShowModal(false);
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BASE_URL}/users/${userId}/reactivate`,
        "GET",
        null,
        {
          Authorization: "bearer " + token,
          "Content-Type": "application/json",
        }
      );

      const responseData = response.data as unknown as { message: string };
      setShowModal(false);
    } catch (err) {}
  };

  return (
    <>
      {showModal && (
        <Modal
          // onSubmit={submitHandler}
          // contentClass="flex flex-col items-center"
        >
          {isLoading && <Loading />}
          {/* {error && <Error error={error} />} */}
          {resMsg && (
            <>
              <h5 className="mb-2">{resMsg}</h5>
              <div className="flex flex-col gap-2 w-full">
                <Button>Yes</Button>
                <Button type="button" onClick={noHandler}>
                  No
                </Button>
              </div>
            </>
          )}
        </Modal>
      )}
    </>
  );
};
export default ActivateModal;
