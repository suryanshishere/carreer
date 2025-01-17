import React, { useMemo } from "react";
import axiosInstance from "shared/utils/api/axios-instance";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Bookmark from "post/shared/Bookmark";
import PostDetailItem from "post/components/PostDetailItem";
import rearrangeObjectByPriority, {
  priorityMapping,
} from "../shared/post-priority-order";
import { snakeCase } from "lodash";
import { IPostDetail } from "models/postModels/IPost";
import { postDetailPriorities } from "../shared/post-priority-array";
import Info from "post/shared/Info";
import NoData from "shared/components/dataStates/NoData";

const fetchPostDetail = async (
  section: string,
  postId: string
): Promise<{ data: IPostDetail; is_saved: boolean }> => {
  const { data } = await axiosInstance.get(
    `/public/sections/${section}/${postId}`
  );
  return data;
};

const getIsSavedStatus = (
  params: URLSearchParams,
  backendIsSaved: boolean
): boolean => params.get("is_saved") === "true" || backendIsSaved;

const PostDetail: React.FC = () => {
  const { section = "", postCode = "" } = useParams<{
    section: string;
    postCode: string;
  }>();
  const location = useLocation();
  const postId = location.state?.postId;

  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const postIdOrCode = postId || postCode;

  const { data = { data: {}, is_saved: false }, isLoading } = useQuery<
    { data: IPostDetail; is_saved: boolean },
    Error
  >({
    queryKey: ["detailPost", section, postId],
    queryFn: () => fetchPostDetail(section, postIdOrCode),
  });

  const orderedData = useMemo(() => {
    return rearrangeObjectByPriority(
      data.data,
      priorityMapping(postDetailPriorities)[snakeCase(section)]
    );
  }, [data.data, section]);

  const isSaved = getIsSavedStatus(params, data.is_saved);

  if (!isLoading && Object.keys(orderedData).length === 0) {
    return <NoData />;
  }

  return (
    <div className="flex flex-col gap-3 items-center relative min-h-screen">
      <div className="self-end flex gap-2 items-center justify-center z-10">
        <Info />
        <Bookmark section={section} postId={postId} isSaved={isSaved} />
      </div>
      <PostDetailItem data={orderedData || {}} />
    </div>
  );
};

export default PostDetail;
