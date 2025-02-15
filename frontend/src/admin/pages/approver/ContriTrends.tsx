import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import RenderArrayTable from "post/components/postDetails/postDetailsUtils/RenderArrayTable";
import axiosInstance from "shared/utils/api/axios-instance";

const ContriTrends = () => {
  const { section } = useParams();
  const {
    data = { data: [] },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["contriTrends"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/admin/approver/contri-post-codes/${section}`
      );
      return response.data;
    },
    retry: 3,
  });


  return (
    <div>
      <RenderArrayTable value={data.data || []} arrTableKey="cool" />
    </div>
  );
};

export default ContriTrends;
