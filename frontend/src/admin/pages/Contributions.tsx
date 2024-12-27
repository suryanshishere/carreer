import { useQuery } from "@tanstack/react-query";
import { startCase } from "lodash";
import { renderArrayTable } from "post/shared/render-array-table";
import React from "react";
import axiosInstance from "shared/utils/api/axios-instance";

const Contributions = () => {
  const {
    data = { data: [] },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["contributionList"],
    queryFn: async () => {
      const response = await axiosInstance.get("/admin/contri-post-codes");
      return response.data;
    },
    retry: 3,
  });

  return <div>{renderArrayTable(data.data, "cool")}</div>;
};

export default Contributions;
