import React from "react";
import { Link } from "react-router-dom";
import NavigateToPostSec from "shared/uiComponents/uiAdmin/NavigateToPostSec";

//TODO : Naming correction, data handling on both backend and frontend (get only completed post data otherwise not for the approvements.)

const Admin = () => {
  return (
    <div>
      <NavigateToPostSec submitName="Get PostAdminData"/>
      <Link to="create_new_post">Create new post</Link>
      <Link to="edit_post">Edit post</Link>
    </div>
  );
};

export default Admin;
