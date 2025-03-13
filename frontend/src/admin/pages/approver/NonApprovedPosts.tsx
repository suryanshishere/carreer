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
import { useMutation, useQuery } from "@tanstack/react-query";
import DoneIcon from "@mui/icons-material/Done";
import ADMIN_DB from "admin/db";
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
  status: string;
  role_applied: string;
}

interface IAccessUpdate extends IAccessFilter {
  req_id: string;
}

const NonApprovedPosts: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.user.userData);
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

  // for fetching access list
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["accessRequests", filters],
    queryFn: async () => {
      if (!filters) return null;
      const response = await axiosInstance.post("/admin/req-access", filters);
      return response.data.data;
    },
    enabled: !!filters,  
  });

  // for updating there access
  const updateAccessMutation = useMutation({
    mutationFn: async ({ req_id, role_applied, status }: IAccessUpdate) => {
      const { data } = await axiosInstance.post(
        "/admin/access-update",
        { req_id, role_applied, status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data;
    },
    onSuccess: ({ message }) => {
      dispatch(triggerSuccessMsg(message || "Updated access successfully!"));
      refetch();
    },
    onError: (error: any) => {
      dispatch(
        triggerErrorMsg(
          error.response?.data?.message || "Failed to update access!"
        )
      );
    },
  });

  return (
    <div className="w-full flex flex-col">
      <PageHeader header="NonApprovedPosts" subHeader="List of the access" />

      <form
        onSubmit={handleSubmit((data) => setFilters(data))}
        className="w-full -mt-3 flex h-16 items-center mobile:justify-end gap-2 mb-7"
      >
        <div className="flex justify-end gap-2">
          <Dropdown
            name="role_applied"
            label="Role applied"
            register={register}
            error={!!errors.role_applied}
            helperText={errors.role_applied?.message}
            data={role_applied}
            classProp="text-sm py-0"
          />
          <Dropdown
            name="status"
            label="Status"
            register={register}
            error={!!errors.status}
            helperText={errors.status?.message}
            data={status}
            classProp="text-sm py-0"
          />
        </div>

        <Button iconButton type="submit" classProp="outline">
          <DoneIcon fontSize="small" />
        </Button>
      </form>

      {filters ? (
        <DataStateWrapper
          isLoading={isLoading}
          error={error}
          data={data}
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
          subHeader="under which you want to fetch the access list"
        />
      )}
    </div>
  );
};

export default NonApprovedPosts;
