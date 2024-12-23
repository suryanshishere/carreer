import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import Button from "shared/utils/form/Button";
import { TextArea } from "shared/utils/form/Input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  triggerErrorMsg,
  triggerSuccessMsg,
} from "shared/store/thunks/response-thunk";
import axiosInstance from "shared/utils/api/axios-instance";

const MIN_REASON_LENGTH =
  Number(process.env.REACT_APP_MIN_REASON_LENGTH) || 100;
const MAX_REASON_LENGTH =
  Number(process.env.REACT_APP_MAX_REASON_LENGTH) || 500;

const validationSchema = yup.object().shape({
  reason: yup
    .string()
    .required("Reason is required.")
    .min(
      MIN_REASON_LENGTH,
      ({ min }) => `Reason must be at least ${min} characters.`
    )
    .max(
      MAX_REASON_LENGTH,
      ({ max }) => `Reason cannot exceed ${max} characters.`
    ),
});

const ReqPublisherAccess: React.FC = () => {
  const { token, role } = useSelector(
    (state: RootState) => state.auth.userData
  );
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onSubmit",
  });
  const dispatch = useDispatch<AppDispatch>();

  const mutation = useMutation({
    mutationFn: async (data: { reason: string }) => {
      const response = await axiosInstance.post(
        "/user/req-publisher-access",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    },
    onSuccess: ({ message }) => {
      dispatch(
        triggerSuccessMsg(message || "Publisher request sent successfully!")
      );
    },
    onError: (error: any) => {
      dispatch(
        triggerErrorMsg(
          error.response?.data?.message || "Publisher request failed!"
        )
      );
    },
  });

  const onSubmit = (data: { reason: string }) => {
    mutation.mutate(data);
  };

  if (role === "publisher") {
    return <h2>Already a publisher</h2>;
  }

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <h2>Apply for Publisher Access</h2>
      <p className="w-1/2 text-start">
        Once you have been granted publisher access, you will be able to create
        new posts. These posts can then be sent for approval before being
        published.
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-1/2 flex gap-2 flex-col"
      >
        <TextArea
          placeholder="Please include your full name, email, and reason for applying."
          classProp="placeholder:text-sm"
          {...register("reason")}
          error={!!errors.reason}
          helperText={errors.reason?.message}
        />
        <Button type="submit">
          {mutation.isPending ? <p>Submitting...</p> : <p>Submit</p>}
        </Button>
      </form>
    </div>
  );
};

export default ReqPublisherAccess;
