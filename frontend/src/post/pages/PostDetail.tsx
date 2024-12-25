import React, { useMemo } from "react";
import axiosInstance from "shared/utils/api/axios-instance";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useQueryStates from "shared/hooks/query-states-hook";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "shared/store";
import Bookmark from "post/shared/Bookmark";
import PostDetailItem from "post/components/PostDetailItem";
import rearrangeObjectByPriority, {
  priorityMapping,
} from "../shared/post-priority-order";
import { snakeCase } from "lodash";
import { IPostDetail } from "models/postModels/IPostDetail";
import { postDetailPriorities } from "../shared/post-priority-array";
import ContributeToPost from "post/components/ContributeToPost";

// Fetch Post Detail API Call
const fetchPostDetail = async (
  section: string,
  postId: string,
  token?: string
): Promise<{ data: IPostDetail; is_saved: boolean }> => {
  const { data } = await axiosInstance.get(
    `/public/sections/${section}/${postId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};

// Helper to get isSaved status
const getIsSavedStatus = (
  params: URLSearchParams,
  backendIsSaved: boolean
): boolean => params.get("is_saved") === "true" || backendIsSaved;

// PostDetail Component
const PostDetail: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth.userData);

  const { section = "" } = useParams<{ section: string }>();
  const location = useLocation();
  const postId = location.state?.postId;
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const dispatch = useDispatch();

  // Fetch Post Details
  const {
    data = { data: {}, is_saved: false },
    isLoading,
    error,
  } = useQuery<{ data: IPostDetail; is_saved: boolean }, Error>({
    queryKey: ["detailPost", section, postId],
    queryFn: () => fetchPostDetail(section, postId, token),
  });

  // Query State Message Handling
  const queryStateMessage = useQueryStates({
    isLoading,
    error: error ? error.message : null,
    empty: Object.keys(data.data).length === 0,
  });

  // Order Data by Priority
  const orderedData = useMemo(() => {
    return rearrangeObjectByPriority(
      data.data,
      priorityMapping(postDetailPriorities)[snakeCase(section)]
    );
  }, [data.data, section]);

  const isSaved = getIsSavedStatus(params, data.is_saved);

  // Avoid early return; render query state as part of JSX
  if (queryStateMessage) {
    return <div>{queryStateMessage}</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="self-end flex gap-2 items-center justify-center">
        <ContributeToPost />
        <Bookmark section={section} postId={postId} isSaved={isSaved} />
      </div>
      {orderedData && <PostDetailItem data={orderedData} />}
    </div>
  );
};

export default PostDetail;
