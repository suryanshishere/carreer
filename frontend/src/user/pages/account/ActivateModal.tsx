import React, { useContext, useEffect, useState } from "react";
import Button from "src/shared/components/form/Button";
import { Input } from "src/shared/components/form/input/Input";
import Error from "src/shared/components/uiElements/common/response/Response&Error";
import Loading from "src/shared/components/uiElements/common/response/Loading";
import Para from "src/shared/components/uiElements/cover/Para";
import Modal from "src/shared/components/uiElements/modal/Modal";
import { AuthContext } from "src/shared/context/auth-context";
import  useAuth  from "src/shared/hooks/auth";
import { useHttpClient } from "src/shared/hooks/http";
import { useDispatch } from "react-redux";
import { responseUIAction } from "src/shared/store/reponse-ui-slice";

const ActivateModal = () => {
  const { token, userId } = useAuth();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [responseMsg, setResponseMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(responseUIAction.setErrorHandler(error));
    dispatch(responseUIAction.isLoadingHandler(isLoading));
  }, [error, isLoading, clearError, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const response = await sendRequest(
            `${process.env.REACT_APP_BASE_URL}/users/${userId}/deactivate-at`,
            "GET",
            null,
            {
              "Content-Type": "application/json",
              Authorization: "bearer " + token,
            }
          );

          const responseData = response.data as unknown as { message: string };
          setResponseMsg(responseData.message);
          setShowModal(true);
        } catch (error) {}
      }
    };

    fetchData();
  }, [sendRequest, userId, token]);


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
      dispatch(responseUIAction.setResponseHandler(responseData.message));
    } catch (err) {}
  };

  return (
    <>
      {showModal && (
        <Modal
          show={showModal}
          onSubmit={submitHandler}
          contentClass="flex flex-col items-center"
        >
          {isLoading && <Loading />}
          {error && <Error error={error} />}
          {responseMsg && (
            <>
              <h5 className="mb-2">{responseMsg}</h5>
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
