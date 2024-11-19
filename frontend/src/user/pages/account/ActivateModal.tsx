import React, { useContext, useState } from "react";
import Button from "shared/utils/form/Button";
import { useHttpClient } from "shared/hooks/http-hook";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import { logout } from "shared/store/auth-slice";

const ActivateModal = () => {
  const { token, userId } = useSelector(
    (state: RootState) => state.auth.userData
  );
  const dispatch = useDispatch<AppDispatch>();
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
    dispatch(logout());
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
        <div
        // onSubmit={submitHandler}
        // contentClass="flex flex-col items-center"
        >
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
        </div>
      )}
    </>
  );
};
export default ActivateModal;
