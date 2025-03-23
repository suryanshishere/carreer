import React, { useState } from "react";
import Dropdown from "shared/utils/form/Dropdown";
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
import DoneIcon from "@mui/icons-material/Done";
import ADMIN_DB, { IStatus } from "admin/db";
import PageHeader from "shared/ui/PageHeader";
import DataStateWrapper from "shared/utils/DataStateWrapper";
import AccessItem from "admin/components/AccessItem";
import Para from "shared/ui/Para";

const { status, role_applied } = ADMIN_DB;

const filterSchema = yup.object().shape({
  role_applied: yup
    .string()
    .required("Role applied is required.")
    .oneOf(role_applied, `Must be one of: ${role_applied.join(", ")}.`),
  status: yup
    .string()
    .required("Status is required.")
    .oneOf(status, `Must be one of: ${status.join(", ")}.`),
});

interface IAccessFilter {
  status: IStatus;
  role_applied: string;
}

interface IAccessUpdate extends IAccessFilter {
  req_id: string;
}

const Access: React.FC = () => { 
  const dispatch = useDispatch<AppDispatch>();
  const [filters, setFilters] = useState<IAccessFilter | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAccessFilter>({
    resolver: yupResolver(filterSchema),
    mode: "onSubmit",
  });

  // Mutation for fetching the access list
  const fetchAccessMutation = useMutation({
    mutationFn: async (filters: IAccessFilter) => {
      const response = await axiosInstance.post(
        "/admin/req-access-list",
        filters
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      if (data !== null) {
        dispatch(triggerSuccessMsg("Access list fetched successfully!"));
      }
    },
  });

  // Mutation for updating access
  const updateAccessMutation = useMutation({
    mutationFn: async ({ req_id, role_applied, status }: IAccessUpdate) => {
      const { data } = await axiosInstance.post("/admin/access-update", {
        req_id,
        role_applied,
        status,
      });
      return data;
    },
    onSuccess: ({ message }) => {
      dispatch(triggerSuccessMsg(message || "Updated access successfully!"));
      // setTimeout(() => {
      //   if (filters) {
      //     fetchAccessMutation.mutate(filters);
      //   }
      // }, 1000);
    },
    onError: (error: any) => {
      dispatch(
        triggerErrorMsg(
          error.response?.data?.message || "Failed to update access!"
        )
      );
    },
  });

  const onSubmit = (data: IAccessFilter) => {
    setFilters(data);
    fetchAccessMutation.mutate(data);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <PageHeader header="Access" subHeader="List of the access" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex h-16 items-center mobile:justify-end gap-2 mb-7"
      >
        <div className="flex justify-end gap-2">
          <Dropdown
            name="role_applied"
            label="Role applied"
            register={register}
            error={!!errors.role_applied}
            helperText={errors.role_applied?.message}
            data={role_applied}
            className="text-sm py-0"
          />
          <Dropdown
            name="status"
            label="Status"
            register={register}
            error={!!errors.status}
            helperText={errors.status?.message}
            data={status}
            className="text-sm py-0"
          />
        </div>

        <Button iconButton type="submit" className="border-2 border-solid">
          <DoneIcon fontSize="small" />
        </Button>
      </form>

      {filters ? (
        <DataStateWrapper
          isLoading={fetchAccessMutation.isPending}
          error={fetchAccessMutation.error}
          data={fetchAccessMutation.data}
          emptyCondition={(data) => !data || data.length === 0}
          nodelay
        >
          {(data) => (
            <AccessItem
              data={data}
              onUpdateAccess={updateAccessMutation.mutate}
            />
          )}
        </DataStateWrapper>
      ) : (
        <Para
          header="Select the role and status"
          subHeader="(Under which you want to fetch the access list)"
        />
      )}
    </div>
  );
};

export default Access;
