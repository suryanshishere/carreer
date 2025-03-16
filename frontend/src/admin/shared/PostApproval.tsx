import { useMutation } from "@tanstack/react-query";
import { ISectionKey } from "posts/db";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "shared/store";
import {
  triggerErrorMsg,
  triggerSuccessMsg,
} from "shared/store/thunks/response-thunk";
import axiosInstance from "shared/utils/api/axios-instance";
import Button from "shared/utils/form/Button";

const PostApproval: React.FC<{ approved: boolean; postId: string }> = ({
  postId,
  approved,
}) => {
  const role = useSelector((state: RootState) => state.user.role);
  const contributeActive = useSelector(
    (state: RootState) => state.post.isEditPostClicked
  );

  const { section } = useParams<{ section: ISectionKey }>();
  const dispatch = useDispatch<AppDispatch>();

  // Local state to update approval status dynamically
  const [isApproved, setIsApproved] = useState(approved);

  const { mutate: toggleApproval, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.patch(
        "/admin/approver/post-approval",
        {
          postId,
          section,
          approved: !isApproved, // Toggle approval state
        }
      );
      return response.data;
    },
    onSuccess: ({ message }) => {
      setIsApproved((prev) => !prev); 
      dispatch(
        triggerSuccessMsg(message || "Post approval updated successfully!")
      );
    },
    onError: (error: any) => {
      dispatch(
        triggerErrorMsg(
          error.response?.data?.message || "Failed to update approval status."
        )
      );
    },
  });

  if (role === "none" || role === "publisher") return null;

  return (
    <Button
      authButtonType
      disabled={contributeActive || isPending}
      className="whitespace-nowrap text-sm p-0 px-2 py-1"
      onClick={() => toggleApproval()}
    >
      {isPending ? "Processing..." : isApproved ? "Disapprove" : "Approve"}
    </Button>
  );
};

export default PostApproval;
