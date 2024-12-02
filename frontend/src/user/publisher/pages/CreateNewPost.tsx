import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Dropdown from "shared/utils/form/input/Dropdown";
import { Input, TextArea } from "shared/utils/form/input/Input";
import SECTIONS from "db/postDb/sections.json";
import Button from "shared/utils/form/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  triggerErrorMsg,
  triggerSuccessMsg,
} from "shared/store/thunks/response-thunk";
import { AppDispatch, RootState } from "shared/store";
import axiosInstance from "shared/utils/api/axios-instance";

const validationSchema = Yup.object().shape({
  name_of_the_post: Yup.string()
    .min(6, `Name of the post must be between 6 and 1000 characters.`)
    .max(1000, `Name of the post must be between 6 and 1000 characters.`)
    .required("Name of the post is required"),
  post_code: Yup.string()
    .min(6, `Post code must be between 6 and 1000 characters.`)
    .max(1000, `Post code must be between 6 and 1000 characters.`)
    .matches(
      /^[A-Za-z0-9_]+$/,
      "Post code can only contain letters, numbers, and underscores, with no spaces."
    )
    .matches(/^[A-Za-z0-9_-]{3,15}$/, "Invalid post code format.")
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
  const navigate = useNavigate();
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
      console.log(data);
      const response = await axiosInstance.post(
        "/user/publisher/create-new-post",
        JSON.stringify(data),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: ({ message }) => {
      dispatch(triggerSuccessMsg(message));
      //not resetting the form cuz to preserve post code
    },
    onError: (error: any) => {
      dispatch(
        triggerErrorMsg(
          error.response?.data?.message || "Post submission failed!"
        )
      );
    },
  });

  const submitHandler: SubmitHandler<ICreateNewPostForm> = (data) => {
    submitMutation.mutate(data);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="w-1/2 flex flex-col gap-4"
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

          <Dropdown
            data={SECTIONS}
            label="section"
            name="section"
            error={!!errors.section}
            helperText={errors.section?.message}
            register={register}
          />
        </div>

        <Button type="submit" disabled={submitMutation.isPending}>
          {submitMutation.isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default CreateNewPost;
