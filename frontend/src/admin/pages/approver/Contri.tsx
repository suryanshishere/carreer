import { useQuery } from "@tanstack/react-query";
import renderObject from "post/shared/render-object";
import React from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "shared/utils/api/axios-instance";

const Contri = () => {
  const { section, postCode } = useParams();
  const {
    data = { data: [] },
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
  // console.log(data);
  return (
    <div className="flex items-start flex-col">
      {data.data.map((item: any) => (
        <>{renderObject(item, "cool")}</>
      ))}
    </div>
  );
};

export default Contri;
