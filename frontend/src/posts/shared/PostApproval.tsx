import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import Button from "shared/utils/form/Button";

const PostApproval: React.FC<{ approved: boolean }> = ({ approved = true }) => {
  const role = useSelector((state: RootState) => state.user.userData.role);
  const contributeActive = useSelector((state:RootState)=> state.post.isEditPostClicked);

  if (!role || role == "none" || role == "publisher") {
    return null;
  }

  // todo: if contribute is active, disabled it, have power for apprver, admin to directly contribute and apply the changes
  // instant disapprove power, approve power
  return (
    <Button authButtonType disabled={contributeActive} classProp="whitespace-nowrap text-sm p-0 px-2 py-1">
      {approved ? "Disapprove" : "Approve"} 
    </Button>
  );
};

export default PostApproval;
