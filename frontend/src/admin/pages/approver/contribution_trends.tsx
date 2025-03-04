import { useQuery } from "@tanstack/react-query";
import RenderTable from "post/post-shared/render-post-data/RenderTable";
import axiosInstance from "shared/utils/api/axios-instance";
import NoData from "shared/components/dataStates/NoData";
import renderPostData from "post/post-shared/render-post-data";

const ContributionTrends: React.FC<{ section: string }> = ({ section }) => {
  const {
    data = { data: [] },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["contributionTrends", section],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/admin/approver/contri-post-codes/${section}`
      );
      return response.data;
    },
    retry: 3,
  });

  if(isLoading){
    return <div>Loading...</div>
  }

  if (!isLoading && data.data.length === 0) {
    return <NoData />;
  }

  return (
    <div className="w-full h-full flex items-start">
      {renderPostData("contributionTrends", data.data)}
    </div>
  );
};

export default ContributionTrends;
