import React from "react";
import Dropdown from "shared/utils/form/Dropdown";
import PUBLISHER_STATUS from "db/adminDb/publisherStatus.json";
import Button from "shared/utils/form/Button";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  triggerErrorMsg,
  triggerSuccessMsg,
} from "shared/store/thunks/response-thunk";
import axiosInstance from "shared/utils/api/axios-instance";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import { useMutation } from "@tanstack/react-query";
import useQueryStates from "shared/hooks/query-states-hook";
import DoneIcon from "@mui/icons-material/Done";

const validationSchema = yup.object().shape({
  status: yup
    .string()
    .required("Reason is required.")
    .oneOf(
      PUBLISHER_STATUS,
      `Status should be one of: ${PUBLISHER_STATUS.join(", ")}.`
    ),
});

const PublisherAccess = () => {
  const { token, role } = useSelector(
    (state: RootState) => state.auth.userData
  );
  const {
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onSubmit",
  });
  const dispatch = useDispatch<AppDispatch>();

  const mutation = useMutation({
    mutationFn: async (data: { status: string }) => {
      const response = await axiosInstance.post(
        "/admin/publisher-access",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    },
    onSuccess: ({ message, data }) => {
      console.log(data);
      dispatch(triggerSuccessMsg(message || "Fetched successfully!"));
    },
    onError: (error: any) => {
      dispatch(
        triggerErrorMsg(
          error.response?.data?.message || "Fetch request failed!"
        )
      );
    },
  });

  const handleClick = (status: string) => {
    mutation.mutate({ status });
  };

  const queryStateMessage = useQueryStates({
    isLoading: mutation.isPending,
    error: null,
    empty: mutation.data?.data.length === 0,
  });

  if (queryStateMessage) return queryStateMessage;

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-end gap-2">
        <Dropdown
          name="status"
          register={register}
          error={!!errors.status}
          helperText={errors.status?.message}
          data={PUBLISHER_STATUS}
        />
        <Button
          onClick={() => handleClick("status")}
          classProp="rounded-full flex items-center justify-center h-auto"
        >
          <DoneIcon />
        </Button>
      </div>

      <ul>
        {mutation.data?.data.map(
          (
            publisher: {
              _id: string;
              email: string;
              status: string;
              reason: string;
            },
            index: number
          ) => (
            <React.Fragment key={publisher._id}>
              <li>
                <strong>
                  {publisher.email}{" "}
                  <span className="text-custom-gray ml-3 italic">
                    {publisher.status}
                  </span>
                </strong>
                {/* <div className="flex gap-2 text-sm">
                  <Dropdown
                    name="status"
                    register={register}
                    error={!!errors.status}
                    helperText={errors.status?.message}
                    data={PUBLISHER_STATUS}
                  />
                  <Button
                    type="submit"
                    classProp="rounded-full flex items-center justify-center"
                  >
                    <DoneIcon />
                  </Button>
                </div> */}
                <p className="text-sm">{publisher.reason}</p>
              </li>
              {index !== mutation.data.data.length - 1 && <hr />}
            </React.Fragment>
          )
        )}
      </ul>
    </div>
  );
};

export default PublisherAccess;
