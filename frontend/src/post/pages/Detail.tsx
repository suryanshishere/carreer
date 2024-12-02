import React from "react";
import DetailItem from "post/components/DetailItem";
import DetailItemHeader from "post/components/DetailItemHeader";
import { IPostDetail, IPostDetailData } from "models/post/IPostDetail";
import axiosInstance from "shared/utils/api/axios-instance";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import "./Detail.css";
import useQueryStates from "shared/hooks/query-states-hook";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import Bookmark from "shared/components/Bookmark";

const fetchPostDetail = async (
  section: string,
  postId: string,
  token?: string
): Promise<IPostDetailData> => {
  const { data } = await axiosInstance.get(`/public/sections/${section}/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

const Detail: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth.userData);
  const { section = "", postId = "" } = useParams<{
    postId: string;
    section: string;
  }>();
  const {
    data = { data: {}, is_saved: false },
    isLoading,
    error,
  } = useQuery<IPostDetailData, Error>({
    queryKey: ["detailPost"],
    queryFn: () => fetchPostDetail(section, postId, token),
  });

  const queryStateMessage = useQueryStates({
    isLoading,
    error: error ? error.message : null,
    empty: Object.keys(data.data).length === 0,
  });

  if (queryStateMessage) return queryStateMessage;

  return (
    <div className="detail_page_sec flex flex-col items-center">
      <DetailItemHeader />
      <h3>postId</h3>
      <Bookmark section={section} postId={postId} isSaved={data.is_saved} />
      {data && <DetailItem detailPageData={data.data} />}
    </div>
  );
};

export default Detail;
