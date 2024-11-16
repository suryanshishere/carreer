import React from "react";
import DetailItem from "post/components/DetailItem";
import DetailItemHeader from "post/components/DetailItemHeader";
import { IPostDetail } from "models/post/IPostDetail";
import axiosInstance from "shared/utils/api/axios-instance";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import "./Detail.css";
import useQueryStates from "shared/hooks/query-states-hook";

const fetchPostDetail = async (
  category: string,
  postId: string
): Promise<IPostDetail> => {
  const { data } = await axiosInstance.get(`/category/${category}/${postId}`);
  return data;
};

const Detail: React.FC = () => {
  const { category = "", postId = "" } = useParams<{
    postId: string;
    category: string;
  }>();
  const {
    data = {},
    isLoading,
    error,
  } = useQuery<IPostDetail, Error>({
    queryKey: ["detailPost"],
    queryFn: () => fetchPostDetail(category, postId),
  });

  const queryStateMessage = useQueryStates({
    isLoading,
    error: error ? error.message : null,
    empty: Object.keys(data).length === 0,
  });

  if (queryStateMessage) return queryStateMessage;

  return (
    <div className="detail_page_sec flex flex-col items-center">
      <DetailItemHeader />
      <h3>postId</h3>
      {data && <DetailItem detailPageData={data} />}
    </div>
  );
};

export default Detail;
