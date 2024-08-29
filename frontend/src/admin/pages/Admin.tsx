import { Button } from "@mui/material";
import React, { useState } from "react";
import { Dropdown } from "shared/utilComponents/form/input/Dropdown";
import POST_SECTION from "db/adminDb/postSection.json";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate(); 
  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const post_section = formData.get("post_section") as string;
    if (!post_section) return;

    navigate(`${post_section}`);
  };

  return (
    <form onSubmit={submitHandler} className="flex gap-2">
      <Dropdown name="post_section" dropdownData={POST_SECTION} />
      <Button type="submit">Get the PostAdminData</Button>
    </form>
  );
};

export default Admin;
