import React from "react";
import  Dropdown from "shared/utils/form/input/Dropdown";
import { Button } from "@mui/material";
import POST_SECTION from "db/postDb/sections.json";
import { useNavigate } from "react-router-dom";

interface NavigateToPostSecProps {
  submitName: string;
}

const NavigateToPostSec: React.FC<NavigateToPostSecProps> = ({
  submitName,
}) => {
  const navigate = useNavigate();
  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const post_section = formData.get("post_section") as string;
    if (!post_section) return;

    navigate(`${post_section}`,{ replace: true });
  };

  return (
    <form onSubmit={submitHandler} className="flex gap-2">
      <Dropdown name="post_section" data={POST_SECTION} />
      <Button type="submit">{submitName}</Button>
    </form>
  );
};

export default NavigateToPostSec;
