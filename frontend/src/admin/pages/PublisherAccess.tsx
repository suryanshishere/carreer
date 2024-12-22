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
import { Input } from "shared/utils/form/Input";

// Validation Schemas
const filterSchema = yup.object().shape({
  status: yup
    .string()
    .required("Status is required.")
    .oneOf(
      PUBLISHER_STATUS,
      `Status should be one of: ${PUBLISHER_STATUS.join(", ")}.`
    ),
});

const updateSchema = yup.object().shape({
  status_update: yup
    .string()
    .required("Status update is required.")
    .oneOf(
      PUBLISHER_STATUS,
      `Status update should be one of: ${PUBLISHER_STATUS.join(", ")}.`
    ),
  publisher_id: yup.string().required("Publisher ID is required."),
});

// Interfaces
interface IAccessFilter {
  status: string;
}

interface IAccessUpdate {
  status_update: string;
  publisher_id: string;
}

const PublisherAccess = () => {
  const { token } = useSelector((state: RootState) => state.auth.userData);
  const dispatch = useDispatch<AppDispatch>();

  // React Hook Form Instances
  const {
    register: filterRegister,
    handleSubmit: handleFilterSubmit,
    formState: { errors: filterErrors },
  } = useForm<IAccessFilter>({
    resolver: yupResolver(filterSchema),
    mode: "onSubmit",
  });

  const {
    register: updateRegister,
    handleSubmit: handleUpdateSubmit,
    formState: { errors: updateErrors },
  } = useForm<IAccessUpdate>({
    resolver: yupResolver(updateSchema),
    mode: "onSubmit",
  });

  // Mutations
  const filterMutation = useMutation({
    mutationFn: async (data: IAccessFilter) => {
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
      dispatch(triggerSuccessMsg(message || "Filter applied successfully!"));
    },
    onError: (error: any) => {
      dispatch(
        triggerErrorMsg(
          error.response?.data?.message || "Filter request failed!"
        )
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: IAccessUpdate) => {
      const response = await axiosInstance.post(
        "/admin/publisher-access-update",
        { publisher_id: data.publisher_id, status: data.status_update },
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
      dispatch(triggerSuccessMsg(message || "Access updated successfully!"));
    },
    onError: (error: any) => {
      dispatch(
        triggerErrorMsg(
          error.response?.data?.message || "Update request failed!"
        )
      );
    },
  });

  const handleFilter = (data: IAccessFilter) => {
    filterMutation.mutate(data);
  };

  const handleUpdate = (data: IAccessUpdate) => {
    console.log(data);
    updateMutation.mutate(data);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Filter Form */}
      <form
        onSubmit={handleFilterSubmit(handleFilter)}
        className="self-end flex items-center gap-2"
      >
        <Dropdown
          name="status"
          register={filterRegister}
          error={!!filterErrors.status}
          helperText={filterErrors.status?.message}
          data={PUBLISHER_STATUS}
        />
        <Button
          type="submit"
          classProp="rounded-full flex items-center justify-center h-auto"
        >
          <DoneIcon />
        </Button>
      </form>

      {/* Publisher List */}
      <ul>
        {filterMutation.data?.data.map(
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
                  {/* Update Form */}
                  <form
                    onSubmit={handleUpdateSubmit(handleUpdate)}
                    className="self-end flex items-center gap-2"
                  >
                    <Input
                      type="hidden"
                      value={publisher._id}
                      {...updateRegister("publisher_id")}
                      error={!!updateErrors.publisher_id}
                      helperText={updateErrors.publisher_id?.message}
                    />
                    <Dropdown
                      name="status_update"
                      register={updateRegister}
                      error={!!updateErrors.status_update}
                      helperText={updateErrors.status_update?.message}
                      data={PUBLISHER_STATUS}
                    />
                    <Button
                      type="submit"
                      classProp="rounded-full flex items-center justify-center h-auto"
                    >
                      <DoneIcon />
                    </Button>
                  </form>
                </strong>
                <p className="text-sm">{publisher.reason}</p>
              </li>
              {index !== filterMutation.data.data.length - 1 && <hr />}
            </React.Fragment>
          )
        )}
      </ul>
    </div>
  );
};

export default PublisherAccess;
