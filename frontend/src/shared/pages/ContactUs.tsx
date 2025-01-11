import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Button from "shared/utils/form/Button";
import { Input, TextArea } from "shared/utils/form/Input";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "shared/utils/api/axios-instance";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import {
  triggerErrorMsg,
  triggerSuccessMsg,
} from "shared/store/thunks/response-thunk";

// Define form values interface
interface IContactUsFormInputs {
  name: string;
  email: string;
  reason: string;
}

const MIN_NAME_LENGTH = Number(process.env.REACT_APP_MIN_NAME_LENGTH) || 3;
const MAX_NAME_LENGTH = Number(process.env.REACT_APP_MAX_NAME_LENGTH) || 100;
const MIN_REASON_LENGTH =
  Number(process.env.REACT_APP_MIN_REASON_LENGTH) || 100;
const MAX_REASON_LENGTH =
  Number(process.env.REACT_APP_MAX_REASON_LENGTH) || 500;

const contactUsSchema = Yup.object().shape({
  name: Yup.string()
    .required("Please provide your name.")
    .min(
      MIN_NAME_LENGTH,
      ({ min }) => `Name must be at least ${min} characters.`
    )
    .max(MAX_NAME_LENGTH, ({ max }) => `Name cannot exceed ${max} characters.`),
  email: Yup.string()
    .email("Please provide a valid email address.")
    .required("An email address is required."),
  reason: Yup.string()
    .required("Please provide a reason for contacting us.")
    .min(
      MIN_REASON_LENGTH,
      ({ min }) => `Reason must be at least ${min} characters.`
    )
    .max(
      MAX_REASON_LENGTH,
      ({ max }) => `Reason cannot exceed ${max} characters.`
    ),
});

const ContactUs: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth.userData);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IContactUsFormInputs>({
    resolver: yupResolver(contactUsSchema),
    mode: "onSubmit",
  });

  const submitMutation = useMutation({
    mutationFn: async (data: IContactUsFormInputs) => {
      const response = await axiosInstance.post(
        "/other/contact-us",
        JSON.stringify(data)
      );
      return response.data;
    },
    onSuccess: ({ message }) => {
      dispatch(triggerSuccessMsg(message || "Submission successfull!"));
    },
    onError: (error: any) => {
      dispatch(
        triggerErrorMsg(error.response?.data?.message || "Submission failed!")
      );
    },
  });

  const onSubmit: SubmitHandler<IContactUsFormInputs> = (data) => {
    submitMutation.mutate(data);
  };

  return (
    <div className="w-full flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        onReset={() => submitMutation.isSuccess}
        className="lg:w-1/2 w-full  flex flex-col gap-3"
      >
        <Input
          type="text"
          label="Name"
          placeholder="Your official name"
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <Input
          type="email"
          label="Email"
          placeholder="Your official email id"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextArea
          placeholder="Reason for which you are contacting us"
          {...register("reason")}
          error={!!errors.reason}
          helperText={errors.reason?.message}
        />
        <Button type="submit">
          {submitMutation.isPending ? "Submiting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default ContactUs;
