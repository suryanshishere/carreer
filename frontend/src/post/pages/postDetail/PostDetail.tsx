import React from "react";
import axiosInstance from "shared/utils/api/axios-instance";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useQueryStates from "shared/hooks/query-states-hook";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import Bookmark from "shared/components/Bookmark";
import DetailItem from "post/components/postDetailItem/PostDetailItem";
import rearrangeObjectByPriority, { priorityMap } from "./post-priority-order";
import { snakeCase } from "lodash";
import { IPostDetail } from "models/postModels/IPostDetail";

const fetchPostDetail = async (
  section: string,
  postId: string,
  token?: string
): Promise<{ data: IPostDetail; is_saved: boolean }> => {
  const { data } = await axiosInstance.get(
    `/public/sections/${section}/${postId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

const PostDetail: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth.userData);
  const { section = "", postId = "" } = useParams<{
    postId: string;
    section: string;
  }>();
  const {
    data = { data: {}, is_saved: false },
    isLoading,
    error,
  } = useQuery<{ data: IPostDetail; is_saved: boolean }, Error>({
    queryKey: ["detailPost"],
    queryFn: () => fetchPostDetail(section, postId, token),
  });

  const queryStateMessage = useQueryStates({
    isLoading,
    error: error ? error.message : null,
    empty: Object.keys(data.data).length === 0,
  });

  if (queryStateMessage) return queryStateMessage;

  const orderData = rearrangeObjectByPriority(
    data.data as IPostDetail,
    priorityMap[snakeCase(section)]
  );

  return (
    <div className="flex flex-col items-center">
      {/* <DetailItemHeader /> */}
      {/* <h3>postId</h3> */}
      <Bookmark section={section} postId={postId} isSaved={data.is_saved} />
      {data && <DetailItem data={orderData as IPostDetail} />}
    </div>
  );
};

export default PostDetail;
