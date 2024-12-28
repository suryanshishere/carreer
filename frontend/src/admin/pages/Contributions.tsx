import { useQuery } from "@tanstack/react-query";
import RenderArrayTable from "shared/ui/RenderArrayTable";
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

  return (
    <div>
      <RenderArrayTable value={data.data || []} key="cool" />
    </div>
  );
};

export default Contributions;
