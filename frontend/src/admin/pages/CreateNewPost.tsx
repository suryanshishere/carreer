import React from "react";
import { Dropdown } from "shared/utilComponents/form/input/Dropdown";
import { Input } from "shared/utilComponents/form/input/Input";
import POST_SECTION from "db/adminDb/postSection.json";
import Button from "shared/utilComponents/form/Button";
import { useHttpClient } from "shared/utilComponents/hooks/http-hook";
import useUserData from "shared/utilComponents/localStorageConfig/use-userData-hook";
import { useNavigate } from "react-router-dom";

//TODO: name of the post length should be greater than certain length
const CreateNewPost = () => {
  const { userId, token } = useUserData();
  const { sendRequest, error } = useHttpClient();
  const navigate = useNavigate();

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const formdata = new FormData(e.target as HTMLFormElement);
    const name_of_the_post = formdata.get("name_of_the_post");
    const post_section = formdata.get("post_section");
    const post_code = formdata.get("post_code");

    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BASE_URL}/admin/private/create_new_post`,
        "POST",
        JSON.stringify({ name_of_the_post, post_section, post_code }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
          userid: userId || "",
        }
      );

      const responseData = response.data as unknown;

      console.log(responseData);
      navigate(0)
    } catch (err) {}
  };

  return (
    <form onSubmit={submitHandler} className="flex flex-col gap-2">
      <Input name="name_of_the_post" required />
      <Input name="post_code" required />
      <Dropdown name="post_section" dropdownData={POST_SECTION} required />
      <Button>Submit </Button>
    </form>
  );
};

export default CreateNewPost;
