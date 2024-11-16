import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Dropdown } from "shared/utils/form/input/Dropdown";
import { Input } from "shared/utils/form/input/Input";
import POST_SECTION from "db/adminDb/postSection.json";
import Button from "shared/utils/form/Button";
import useUserData from "shared/hooks/user-data-hook";
import { useNavigate } from "react-router-dom";
import { ResponseContext } from "shared/context/response-context";

// Validation schema using Yup
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
  const navigate = useNavigate();
  const response = React.useContext(ResponseContext);

  // Setup form with React Hook Form and Yup for validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateNewPostForm>({
    resolver: yupResolver(validationSchema),
    mode: "onSubmit",
  });

  // Mutation for form submission
  const submitMutation = useMutation({
    mutationFn: async (data: ICreateNewPostForm) => {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/admin/private/create_new_post`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            userid: userId || "",
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      response.setSuccessMsg(data.message);
      navigate(0);
    },
    onError: (error: any) => {
      response.setErrorMsg(
        error.response?.data?.message || "Submission failed!"
      );
      console.error("Submission failed", error);
    },
  });

  // Submit handler for the form
  const submitHandler: SubmitHandler<ICreateNewPostForm> = (data) => {
    submitMutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="flex flex-col gap-2"
    >
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

      <Button type="submit" disabled={submitMutation.isPending}>
        {submitMutation.isPending ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
};

export default CreateNewPost;
