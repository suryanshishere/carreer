import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import Dropdown from "shared/utils/form/Dropdown";
import { Input, TextArea } from "shared/utils/form/Input";
import Button from "shared/utils/form/Button";
import { useDispatch } from "react-redux";
import {
  triggerErrorMsg,
  triggerSuccessMsg,
} from "shared/store/thunks/response-thunk";
import { AppDispatch } from "shared/store";
import axiosInstance from "shared/utils/api/axios-instance";
import _ from "lodash";
import {
  ICreateNewPostForm,
  validationSchema,
} from "admin/shared/admin_form_validation";
import POST_DB from "posts/db";
import PageHeader from "shared/ui/PageHeader";

const CreateNewPost: React.FC = () => {
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
        "/admin/publisher/create-new-post",
        JSON.stringify(data)
      );
      return response.data;
    },
    onSuccess: ({ message }) => {
      dispatch(triggerSuccessMsg(message || "Post submission successfull!", 7));
    },
    onError: (error: any) => {
      dispatch(
        triggerErrorMsg(
          error.response?.data?.message || "Post submission failed!",
          7
        )
      );
    },
  });

  const submitHandler: SubmitHandler<ICreateNewPostForm> = (data) => {
    // Preprocess post_code
    const formattedPostCode = _.lowerCase(data.post_code).replace(/\s+/g, "_");

    // Preprocess version only if it exists
    const formattedVersion = data.version
      ? _.lowerCase(data.version).replace(/\s+/g, "_")
      : undefined;

    const updatedData = {
      ...data,
      post_code: formattedPostCode,
      ...(formattedVersion && { version: formattedVersion }),
    };

    submitMutation.mutate(updatedData);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <PageHeader
        header="Create New Post"
        subHeader="Post created through generative AI"
      />
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="lg:w-2/3 w-full flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <TextArea
            label="name_of_the_post"
            placeholder="Name of the Post"
            row={2}
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
          <Input
            label="Version"
            placeholder="Optional if post version needed!"
            {...register("version")}
            error={!!errors.version}
            helperText={errors.version?.message}
          />
          <Input
            label="Your Gemini API Key"
            placeholder="Optional if post generation not working!"
            {...register("api_key_from_user")}
            error={!!errors.api_key_from_user}
            helperText={errors.api_key_from_user?.message}
          />
          <Dropdown
            data={POST_DB.sections}
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
