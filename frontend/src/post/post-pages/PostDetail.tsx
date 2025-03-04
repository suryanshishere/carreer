import React, { useMemo } from "react";
import axiosInstance from "shared/utils/api/axios-instance";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Bookmark from "post/post-shared/Bookmark";
import PostDetailItem from "post/post-components/post-detail";
import rearrangeObjectByPriority, {
  priorityMapping,
} from "../post-components/post-detail/post-detail-utils/post-priority-order";
import { snakeCase } from "lodash";
import { IPostDetail } from "models/postModels/IPost";
import { postDetailPriorities } from "../post-components/post-detail/post-detail-utils/post-priority-array";
import Info from "post/post-components/post-detail/info";
import NoData from "shared/components/dataStates/NoData";

const fetchPostDetail = async (
  section: string,
  postIdOrCode: string,
  version: string
): Promise<{ data: IPostDetail; is_saved: boolean }> => {
  const { data } = await axiosInstance.get(
    `/public/sections/${section}/${postIdOrCode}/${version}`
  );
  return data;
};

const PostDetail: React.FC = () => {
  const {
    section = "",
    postCode = "",
    version = "",
  } = useParams<{
    section: string;
    postCode: string;
    version: string;
  }>();

  const location = useLocation();
  const postId = location.state?.postId;

  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const postIdOrCode = postId || postCode;
  const versionParam = version || "main";

  const { data = { data: {}, is_saved: false }, isLoading } = useQuery<
    { data: IPostDetail; is_saved: boolean },
    Error
  >({
    queryKey: ["detailPost", section, postIdOrCode, versionParam],
    queryFn: () => fetchPostDetail(section, postIdOrCode, versionParam),
  });

  const orderedData = useMemo(
    () =>
      rearrangeObjectByPriority(
        data.data,
        priorityMapping(postDetailPriorities)[snakeCase(section)]
      ),
    [data.data, section]
  );

  const isSaved = params.get("is_saved") === "true" || data.is_saved;

  if (!isLoading && Object.keys(orderedData).length === 0) {
    return <NoData />;
  }

  return (
    <div className="flex flex-col gap-3 items-center relative min-h-screen">
      <div className="self-end flex gap-2 items-center justify-center z-10">
        <Info />
        <Bookmark section={section} postId={postIdOrCode} isSaved={isSaved} />
      </div>
      <PostDetailItem data={orderedData} />
    </div>
  );
};

export default PostDetail;
