import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import Dropdown from "shared/utils/form/Dropdown";
import { Input, TextArea } from "shared/utils/form/Input";
<<<<<<< HEAD:frontend/src/user/publisher/pages/CreateNewPost.tsx
import SECTIONS from "db/postDb/sections.json";
import Button from "shared/utils/form/Button";
import { useDispatch, useSelector } from "react-redux";
=======
import Button from "shared/utils/form/Button";
import { useDispatch } from "react-redux";
>>>>>>> user:frontend/src/admin/pages/CreateNewPost.tsx
import {
  triggerErrorMsg,
  triggerSuccessMsg,
} from "shared/store/thunks/response-thunk";
import { AppDispatch } from "shared/store";
import axiosInstance from "shared/utils/api/axios-instance";
<<<<<<< HEAD:frontend/src/user/publisher/pages/CreateNewPost.tsx

const validationSchema = Yup.object().shape({
  name_of_the_post: Yup.string()
    .min(6, `Name of the post must be between 6 and 1000 characters.`)
    .max(500, `Name of the post must be between 6 and 1000 characters.`)
    .required("Name of the post is required"),
  post_code: Yup.string()
    .min(6, `Post code must be between 6 and 1000 characters.`)
    .max(100, `Post code must be between 6 and 1000 characters.`)
    .matches(
      /^[A-Za-z0-9_]+$/,
      "Post code can only contain letters, numbers, and underscores, with no spaces."
    )
    .required("Post code is required"),
  section: Yup.string().required("Please select an option."),
});

interface ICreateNewPostForm {
  name_of_the_post: string;
  post_code: string;
  section: string;
}

const CreateNewPost: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth.userData);
=======
import _ from "lodash";
import {
  ICreateNewPostForm,
  validationSchema,
} from "shared/validation/admin-validation";
import { POST_DATA } from "env-data";

const CreateNewPost: React.FC = () => {
>>>>>>> user:frontend/src/admin/pages/CreateNewPost.tsx
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateNewPostForm>({
    resolver: yupResolver(validationSchema),
    mode: "onSubmit",
  });

  const submitMutation = useMutation({
    mutationFn: async (data: ICreateNewPostForm) => {
      const response = await axiosInstance.post(
        "/publisher/create-new-post",
        JSON.stringify(data)
      );
      return response.data;
    },
    onSuccess: ({ message }) => {
<<<<<<< HEAD:frontend/src/user/publisher/pages/CreateNewPost.tsx
      dispatch(triggerSuccessMsg(message || "Post submission successfull!"));
      //not resetting the form cuz to preserve post code
=======
      dispatch(triggerSuccessMsg(message || "Post submission successfull!",7));
>>>>>>> user:frontend/src/admin/pages/CreateNewPost.tsx
    },
    onError: (error: any) => {
      dispatch(
        triggerErrorMsg(
          error.response?.data?.message || "Post submission failed!",7
        )
      );
    },
  });

  const submitHandler: SubmitHandler<ICreateNewPostForm> = (data) => {
    // Preprocess post_code
    const formattedPostCode = _.lowerCase(data.post_code).replace(/\s+/g, "_");
    const updatedData = { ...data, post_code: formattedPostCode };

    submitMutation.mutate(updatedData);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="lg:w-1/2 w-full flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <TextArea
            label="name_of_the_post"
            placeholder="Name of the Post"
            {...register("name_of_the_post")}
            error={!!errors.name_of_the_post}
            helperText={errors.name_of_the_post?.message}
          />
          <Input
            label="post_code"
            placeholder="Post Code"
            {...register("post_code")}
            error={!!errors.post_code}
            helperText={errors.post_code?.message}
          />
          //TODO
          <Input
            label
            placeholder="Gemini API Key"
            {...register("api_key")}
            error={!!errors.api_key}
            helperText={errors.api_key?.message}
          />
          <Dropdown
            data={POST_DATA.SECTIONS}
            label="section"
            name="section"
            error={!!errors.section}
            helperText={errors.section?.message}
            register={register}
          />
        </div>

        <Button type="submit" disabled={submitMutation.isPending}>
          {submitMutation.isPending ? "Generating..." : "Generate"}
        </Button>
      </form>
    </div>
  );
};

export default CreateNewPost;
