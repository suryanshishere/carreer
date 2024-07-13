import { IconButton } from "@mui/material";
import React, { useEffect } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import useAuth  from "src/shared/hooks/auth";
import { useHttpClient } from "src/shared/hooks/http";
import { useDispatch } from "react-redux";
import { responseUIAction } from "src/shared/store/reponse-ui-slice";

interface DeleteProps {
  itemId: string | number; // Accept itemId
  onDelete: (id: string | number) => void;
}

const Delete: React.FC<DeleteProps> = ({ itemId, onDelete }) => {
  const { sendRequest, error, isLoading, clearError } = useHttpClient();
  const { token, userId } = useAuth();

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
