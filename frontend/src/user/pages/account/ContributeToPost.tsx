import React from "react";
import { Dropdown } from "shared/utilComponents/form/input/Dropdown";
import POST_SECTION from "db/adminDb/postSection.json";
import Button from "shared/utilComponents/form/Button";

import { IPostDetail } from "models/post/IPostDetail";
import { useNavigate } from "react-router-dom";
import NavigateToPostSec from "shared/uiComponents/uiAdmin/NavigateToPostSec";

const ContributeToPost: React.FC = () => {
  const navigate = useNavigate();

  const getPostCodeHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const post_section = formData.get("post_section") as string;
    if (!post_section) return;
    navigate(post_section);
  };

  return <NavigateToPostSec submitName="Get Post Code" />;
};

export default ContributeToPost;
