import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Dropdown } from "shared/utilComponents/form/input/Dropdown";
import { Input } from "shared/utilComponents/form/input/Input";
import POST_SECTION from "db/adminDb/postSection.json";
import Button from "shared/utilComponents/form/Button";
import { useHttpClient } from "shared/utilComponents/hooks/http-hook";
import useUserData from "shared/utilComponents/hooks/user-data-hook";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { dataStatusUIAction } from "shared/utilComponents/store/data-status-ui";

// Schema validation with Yup
const validationSchema = Yup.object().shape({
  name_of_the_post: Yup.string()
    .min(5, "Name of the post should be at least 5 characters long")
    .required("Name of the post is required"),
  post_code: Yup.string()
    .matches(/^[A-Za-z0-9_-]{3,15}$/, "Invalid post code format")
    .required("Post code is required"),
  post_section: Yup.string().required("Post section is required"),
});

// Interface for form inputs
interface ICreateNewPostForm {
  name_of_the_post: string;
  post_code: string;
  post_section: string;
}

const CreateNewPost: React.FC = () => {
  const { userId, token } = useUserData();
  const { sendRequest } = useHttpClient();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Use the useForm hook and set up validation with Yup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateNewPostForm>({
    resolver: yupResolver(validationSchema),
    mode: "onSubmit",
  });

  const submitHandler: SubmitHandler<ICreateNewPostForm> = async (data) => {
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BASE_URL}/admin/private/create_new_post`,
        "POST",
        JSON.stringify(data),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          userid: userId || "",
        }
      );
      dispatch(dataStatusUIAction.setResMsg(response.data.message));
      navigate(0);
    } catch (err) {
      console.error("Submission failed", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-2">
      <Input
        placeholder="Name of the Post"
        {...register("name_of_the_post")}
        error={!!errors.name_of_the_post}
        helperText={errors.name_of_the_post?.message}
      />

      <Input
        placeholder="Post Code"
        {...register("post_code")}
        error={!!errors.post_code}
        helperText={errors.post_code?.message}
      />

      <Dropdown
        dropdownData={POST_SECTION}
        name="post_section"
        error={!!errors.post_section}
        helperText={errors.post_section?.message}
        register={register}
      />

      <Button type="submit">Submit</Button>
    </form>
  );
};

export default CreateNewPost;
