import { IconButton } from "@mui/material";
import React, { useEffect } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useHttpClient } from "shared/hooks/http-hook";
import { useDispatch } from "react-redux";
import { responseUIAction } from "shared/store/reponse-ui-slice";
import useUserData from "shared/localStorageConfig/userData-hook";

interface DeleteProps {
  itemId: string | number; // Accept itemId
  onDelete: (id: string | number) => void;
}

const Delete: React.FC<DeleteProps> = ({ itemId, onDelete }) => {
  const { sendRequest, error, isLoading, clearError } = useHttpClient();
  const { token, userId } = useUserData();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(responseUIAction.setErrorHandler(error));
    dispatch(responseUIAction.isLoadingHandler(isLoading));
  }, [error, isLoading, clearError, dispatch]);

  const deleteHandler = async () => {
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BASE_URL}/users/${userId}/save_exam`,
        "DELETE",
        JSON.stringify({
          examId: itemId,
        }),
        {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        }
      );

      onDelete(itemId);
      dispatch(responseUIAction.setResponseHandler(response.data.message));
    } catch (err) {}
  };

  return (
    <IconButton onClick={deleteHandler}>
      <DeleteOutlinedIcon />
    </IconButton>
  );
};

export default Delete;
