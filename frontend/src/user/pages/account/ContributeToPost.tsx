import React, { useEffect, useState } from "react";

import { dataStatusUIAction } from "shared/utilComponents/store/dataStatus-ui-slice";
import { Dropdown } from "shared/utilComponents/form/input/Dropdown";
import POST_SECTION from "db/adminDb/postSection.json";
import Button from "shared/utilComponents/form/Button";
import PostSectionForm from "user/components/account/createForm/PostSectionForm";
// import PostDatesForm from "user/components/account/createForm/createFormOverall/PostDatesForm";
// import PostFeesForm from "user/components/account/createForm/createFormOverall/PostFeesForm";
// import PostLinksForm from "user/components/account/createForm/createFormOverall/PostLinksForm";
import { IContributeInputForm } from "models/userModel/account/contributeToPost/IContributeInputForm";

import { IPostDetail } from "models/post/IPostDetail";
import { useNavigate } from "react-router-dom";

const ContributeToPost: React.FC = () => {
  const navigate = useNavigate();

  const getPostCodeHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const post_section = formData.get("post_section") as string;
    if (!post_section) return;

    navigate(post_section);
  };

  return (
    <form onSubmit={getPostCodeHandler} className="flex gap-2">
      <Dropdown name="post_section" dropdownData={POST_SECTION} />
      <Button type="submit">Get Post Code</Button>
    </form>
  );
};

export default ContributeToPost;
