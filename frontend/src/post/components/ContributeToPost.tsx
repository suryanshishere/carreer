import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import {
  resetKeyValuePairs,
  setEditPostClicked,
} from "shared/store/post-slice";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import axiosInstance from "shared/utils/api/axios-instance";
import { useMutation } from "@tanstack/react-query";

const ContributeToPost = () => {
  const { isEditPostClicked, isAllKeyValuePairsStored, keyValuePairs } =
    useSelector((state: RootState) => state.post);

  const dispatch = useDispatch<AppDispatch>();

  // Mutation to submit keyValuePairs to backend
  const mutation = useMutation({
    mutationFn: async (keyValuePairs: Record<string, any>) => {
      console.log(keyValuePairs);
      const response = await axiosInstance.post(
        "/user/contribute",
        keyValuePairs
      );
      return response.data;
    },
    onSuccess: () => {
      alert("Data submitted successfully!");
      dispatch(resetKeyValuePairs());
    },
    onError: (error: any) => {
      alert(`Failed to submit data: ${error.message}`);
    },
  });

  const handleSubmit = () => {
    mutation.mutate(keyValuePairs); // Trigger mutation with current keyValuePairs
  };

  return (
    <>
      {!isEditPostClicked ? (
        <EditOutlinedIcon
          onClick={() => dispatch(setEditPostClicked(true))}
          className="p-1 hover:bg-custom-pale-yellow hover:cursor-pointer hover:text-custom-gray text-custom-super-less-gray flex justify-center items-center rounded-full"
        />
      ) : (
        <button onClick={() => dispatch(resetKeyValuePairs())}>Undo</button>
      )}
      {isAllKeyValuePairsStored && (
        <button onClick={handleSubmit} disabled={mutation.isPending}>
          {mutation.isPending ? "Submitting..." : "Submit"}
        </button>
      )}
    </>
  );
};

export default ContributeToPost;
