import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import renderObject from "post/post_shared/render_post_data/render_object";
import React from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch } from "shared/store";
import {
  triggerErrorMsg,
  triggerSuccessMsg,
} from "shared/store/thunks/response-thunk";
import axiosInstance from "shared/utils/api/axios-instance";

const Contri = () => {
  const { section, postCode } = useParams();
  const {
    data = { data: [], POST_DB: {} },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["contri"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/admin/approver/contri-post-codes/${section}/${postCode}`
      );
      return response.data;
    },
    retry: 3,
  });
  const dispatch = useDispatch<AppDispatch>();

  const applyMutation = useMutation({
    mutationFn: async ({
      id,
      key,
      value,
    }: {
      id: string;
      key: string;
      value: any;
    }) => {
      const response = await axiosInstance.post(
        "/admin/approver/apply-contri",
        JSON.stringify({
          contributor_id: id,
          data: { [key]: value },
          post_code: postCode,
          section,
        })
      );
      return response.data;
    },
    onSuccess: ({ message }) => {
      dispatch(
        triggerSuccessMsg(message || "Applying contribution successful!")
      );
    },
    onError: (error: any) => {
      dispatch(
        triggerErrorMsg(
          error.response?.data?.message || "Applying contribution failed!"
        )
      );
    },
  });

  const applyHandler = (id: string, key: string, value: any) => {
    applyMutation.mutate({ id, key, value });
  };
console.log(data.data)
  return (
    <div className="flex gap-2">
      <div className="flex items-start flex-col gap-2">
        {data.data.map((item: any, index: number) => (
          <div key={index} className="flex flex-col">
            <strong>ID:</strong> {item._id}
            {Object.entries(item)
              .filter(([key]) => key !== "_id") // Skip _id for rendering
              .map(([key, value]) => (
                <div key={key} className="flex gap-2">
                  <strong>{key}:</strong>
                  {value as React.ReactNode}
                  <button
                    onClick={() => applyHandler(item._id, key, value)}
                    className="outline"
                  >
                    Apply
                  </button>
                </div>
              ))}
            <hr />
          </div>
        ))}
      </div>
      <div className=""></div>
    </div>
  );
};

export default Contri;
