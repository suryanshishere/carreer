import React from "react";
import { Link } from "react-router-dom";

//TODO : Naming correction, data handling on both backend and frontend (get only completed post data otherwise not for the approvements.)

const Admin = () => {
  return (
    <div className="flex gap-2">      
      <Link to="approve_post">Approve Post</Link>
      <Link to="create_new_post">Create new post</Link>
      <Link to="posts">Posts</Link>
    </div>
  );
};

export default Admin;
