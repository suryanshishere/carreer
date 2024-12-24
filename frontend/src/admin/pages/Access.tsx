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
import ADMIN_DB from "db/adminDb/admin-db";
import { startCase, upperCase } from "lodash";
import moment from "moment";

const { STATUS, ROLE_APPLIED, STATUS_CLASSNAME } = ADMIN_DB;

// Validation Schemas
const filterSchema = yup.object().shape({
  role_applied: yup
    .string()
    .required("Role applied is required.")
    .oneOf(
      ROLE_APPLIED,
      `Status should be one of: ${ROLE_APPLIED.join(", ")}.`
    ),
  status: yup
    .string()
    .required("Status is required.")
    .oneOf(STATUS, `Status should be one of: ${STATUS.join(", ")}.`),
});

const updateSchema = yup.object().shape({
  status_update: yup
    .string()
    .required("Status update is required.")
    .oneOf(STATUS, `Status update should be one of: ${STATUS.join(", ")}.`),
  publisher_id: yup.string().required("Publisher ID is required."),
});

interface IAccessFilter {
  status: string;
  role_applied: string;
}

interface IAccessUpdate extends IAccessFilter {
  req_id: string;
}

const PublisherAccess = () => {
  const { token } = useSelector((state: RootState) => state.auth.userData);
  const dispatch = useDispatch<AppDispatch>();
  const [status, setStatus] = useState<string | null>(null);

  // React Hook Form Instances
  const {
    register: filterRegister,
    handleSubmit: handleFilterSubmit,
    formState: { errors: filterErrors },
  } = useForm<IAccessFilter>({
    resolver: yupResolver(filterSchema),
    mode: "onSubmit",
  });

  // const {
  //   register: updateRegister,
  //   handleSubmit: handleUpdateSubmit,
  //   formState: { errors: updateErrors },
  // } = useForm<IAccessUpdate>({
  //   resolver: yupResolver(updateSchema),
  //   mode: "onSubmit",
  // });

  // Mutations
  const filterMutation = useMutation({
    mutationFn: async (data: IAccessFilter) => {
      setStatus(data.status);
      const response = await axiosInstance.post("/admin/req-access", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: ({ message, data }) => {
      dispatch(triggerSuccessMsg(message || "Filter applied successfully!"));
    },
    onError: (error: any) => {
      setStatus(null);
      dispatch(
        triggerErrorMsg(
          error.response?.data?.message || "Filter request failed!"
        )
      );
    },
  });

  // const updateMutation = useMutation({
  //   mutationFn: async (data: IAccessUpdate) => {
  //     const response = await axiosInstance.post(
  //       "/admin/publisher-access-update",
  //       { publisher_id: data.publisher_id, status: data.status_update },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     return response.data;
  //   },
  //   onSuccess: ({ message, data }) => {
  //     console.log(data);
  //     dispatch(triggerSuccessMsg(message || "Access updated successfully!"));
  //   },
  //   onError: (error: any) => {
  //     dispatch(
  //       triggerErrorMsg(
  //         error.response?.data?.message || "Update request failed!"
  //       )
  //     );
  //   },
  // });

  const handleFilter = (data: IAccessFilter) => {
    // console.log(data);
    filterMutation.mutate(data);
  };

  // const handleUpdate = (data: IAccessUpdate) => {
  //   console.log(data);
  //   updateMutation.mutate(data);
  // };

  const { mutate: updateAccess } = useMutation({
    mutationFn: async ({ req_id, role_applied, status }: IAccessUpdate) => {
      const { data } = await axiosInstance.post(
        "/admin/access-update",
        JSON.stringify({ req_id, role_applied, status }),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    },
    onSuccess: ({ message }) => {
      dispatch(triggerSuccessMsg(message || "Updated access successfully!"));
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
    <div className="w-full flex flex-col gap-3">
      <form
        onSubmit={handleFilterSubmit(handleFilter)}
        className="flex justify-end max-h-16 items-center gap-2 mb-4"
      >
        <div className="flex gap-2">
          <Dropdown
            name="role_applied"
            label="Role applied"
            register={filterRegister}
            error={!!filterErrors.role_applied}
            helperText={filterErrors.role_applied?.message}
            data={ROLE_APPLIED}
            classProp="text-sm py-0"
          />
          <Dropdown
            name="status"
            label="Status"
            register={filterRegister}
            error={!!filterErrors.status}
            helperText={filterErrors.status?.message}
            data={STATUS}
            classProp="text-sm py-0"
          />
        </div>
        <Button
          type="submit"
          classProp="rounded-full self-end mb-1 flex justify-center items-center"
        >
          <DoneIcon fontSize="small" />
        </Button>
      </form>

      <ul className="flex flex-col gap-2 ">
        {filterMutation.data?.data.map(
          (
            publisher: {
              _id: string;
              user: { email: string };
              status: string;
              reason: string;
              updatedAt: string;
              role_applied: string;
            },
            index: number
          ) => (
            <React.Fragment key={publisher._id}>
              <li>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <h2 className="self-start pl-0">{publisher.user.email}</h2>
                    <div className="text-sm font-semibold flex gap-1 items-center">
                      <span className="text-xs px-2 bg-custom-super-less-gray rounded-full">
                        {startCase(publisher.status)}
                      </span>
                      <span className="text-xs px-2 bg-custom-super-less-gray rounded-full">
                        {startCase(publisher.role_applied)}
                      </span>
                      {moment(publisher.updatedAt).format("LL")}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 mb-2 items-center">
                    {STATUS.map(
                      (item: string) =>
                        item !== publisher.status && (
                          <button
                            key={item}
                            onClick={() =>
                              updateAccess({
                                req_id: publisher._id,
                                role_applied: publisher.role_applied,
                                status: item,
                              })
                            }
                            className={`text-sm border rounded-full px-3 py-[2px] hover:text-custom-white ${STATUS_CLASSNAME[item]}`}
                          >
                            {startCase(item)}
                          </button>
                        )
                    )}
                  </div>
                </div>

                {/* <form
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
                  </form> */}
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
