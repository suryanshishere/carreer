import { IconButton } from "@mui/material";
import React, { useEffect } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useHttpClient } from "shared/utilComponents/hooks/http-hook";
import { useDispatch } from "react-redux";
import { dataStatusUIAction } from "shared/utilComponents/store/data-status-ui";
import useUserData from "shared/utilComponents/localStorageConfig/use-userData-hook";

interface DeleteProps {
  itemId: string | number; // Accept itemId
  onDelete: (id: string | number) => void;
}

const Delete: React.FC<DeleteProps> = ({ itemId, onDelete }) => {
  const { sendRequest, error,  clearError } = useHttpClient();
  const { token, userId } = useUserData();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(dataStatusUIAction.setErrorHandler(error));
  }, [error,  clearError, dispatch]);

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
      dispatch(dataStatusUIAction.setResMsg(response.data.message));
    } catch (err) {}
  };

  return (
    <IconButton onClick={deleteHandler}>
      <DeleteOutlinedIcon />
    </IconButton>
  );
};

export default Delete;
