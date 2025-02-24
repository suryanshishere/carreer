import { useQuery } from "@tanstack/react-query"; 
import { useParams } from "react-router-dom"; 
import RenderTable from "post/post_shared/render_post_data/render_table";
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
      <RenderTable value={data.data || []} tableKey="cool" />
    </div>
  );
};

export default ContriTrends;
