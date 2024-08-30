import { Button } from "@mui/material";
import React from "react";
import { Dropdown } from "shared/utilComponents/form/input/Dropdown";
import POST_SECTION from "db/adminDb/postSection.json";
import { useNavigate, Link } from "react-router-dom";

//TODO : Naming correction, data handling on both backend and frontend (get only completed post data otherwise not for the approvements.)

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
      <Link to="create_new_post">Create new posta</Link>
    </form>
  );
};

export default Admin;
