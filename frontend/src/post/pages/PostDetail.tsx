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
  const { section = "" } = useParams<{
    section: string;
    postCode: string;
  }>();
  const location = useLocation();
  const postId = location.state?.postId;
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const {
    data = { data: {}, is_saved: false },
    isLoading,
    error,
  } = useQuery<{ data: IPostDetail; is_saved: boolean }, Error>({
    queryKey: ["detailPost", section, postId],
    queryFn: () => fetchPostDetail(section, postId),
  });

  const orderedData = useMemo(() => {
    return rearrangeObjectByPriority(
      data.data,
      priorityMapping(postDetailPriorities)[snakeCase(section)]
    );
  }, [data.data, section]);

  const isSaved = getIsSavedStatus(params, data.is_saved);

  return (
    <div className="flex flex-col items-center relative min-h-screen">
      <div className="self-end flex gap-2 items-center justify-center sticky top-0 bg-white z-10">
        <Info />
        <Bookmark section={section} postId={postId} isSaved={isSaved} />
      </div>
      {orderedData && <PostDetailItem data={orderedData} />}
    </div>
  );
};

export default PostDetail;
