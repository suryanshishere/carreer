import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
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
import Dropdown from "shared/utils/form/Dropdown";
import ADMIN_DB from "db/admin-db";

const MIN_REASON_LENGTH =
  Number(process.env.REACT_APP_MIN_REASON_LENGTH) || 100;
const MAX_REASON_LENGTH =
  Number(process.env.REACT_APP_MAX_REASON_LENGTH) || 500;

interface IRequestAccess {
  reason: string;
  role_applied: string;
}

const RequestAccess: React.FC = () => {
  const { token, role } = useSelector(
    (state: RootState) => state.auth.userData
  );
  const validationSchema = yup.object().shape({
    role_applied: yup
      .string()
      .required("Role applied is required!")
      .notOneOf([role], "You already have access for the role!"),
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

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<IRequestAccess>({
    resolver: yupResolver(validationSchema),
    mode: "onSubmit",
  });
  const dispatch = useDispatch<AppDispatch>();

  const mutation = useMutation({
    mutationFn: async (data: IRequestAccess) => {
      const response = await axiosInstance.post("/user/req-access", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
    onSuccess: ({ message }) => {
      reset();
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

  const onSubmit = (data: IRequestAccess) => {
    mutation.mutate(data);
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <h2>Apply for Access</h2>
      <p className="lg:w-4/5 w-full  text-start">
        1. Once you have been granted publisher access, you will be able to
        create new posts. These posts can then be sent for approval before being
        published. <br />
        <br />
        2. Once you have been granted approver access, you will be able to
        approve created posts. These posts will then be displayed on the site.{" "}
        <br />
        <br />
        3. Once you have been granted admin access, you will be able to create
        new posts, approve created posts, manage publisher and approver access
        requests, view publisher and approver lists, and more. Only when
        guaranteed by the admin, you then only get access here.
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="lg:w-1/2 w-full  flex gap-2 flex-col"
      >
        <Dropdown
          name="role_applied"
          label
          data={ADMIN_DB.role_applied}
          register={register}
          error={!!errors.role_applied}
          helperText={errors.role_applied?.message}
        />
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

export default RequestAccess;
