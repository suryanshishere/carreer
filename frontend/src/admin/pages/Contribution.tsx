import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axiosInstance from "shared/utils/api/axios-instance";

const Contribution = () => {
  const { postCode } = useParams();
  const {
    data = { data: [] },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["contributionList"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/admin/contri-post/${postCode}`
      );
      return response.data;
    },
    retry: 3,
  });
  console.log(data)
  return (
    <div>
      
    </div>
  );
  
};

export default Contribution;
