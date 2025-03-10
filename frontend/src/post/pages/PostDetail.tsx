import React, { useMemo } from "react";
import axiosInstance from "shared/utils/api/axios-instance";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Bookmark from "post/shared/Bookmark";
import PostDetailItem from "post/components/post-detail"; 
import Info from "post/components/post-detail/Info";
import postDetailByPriority from "../shared/post-detail-by-priority";
import { POST_DETAILS_PRIORITY } from "post/db/renders";
import DataStateWrapper from "shared/components/DataStateWrapper";

const fetchPostDetail = async (
  section: string,
  postIdOrCode: string,
  version: string
): Promise<{ data: any; is_saved: boolean }> => {
  const { data } = await axiosInstance.get(
    `/public/sections/${section}/${postIdOrCode}/${version}`
  );
  return data;
};

const PostDetail: React.FC = () => {
  const { section = "", postCode = "", version = "" } =
    useParams<{
      section: string;
      postCode: string;
      version: string;
    }>();

  const location = useLocation();
  const postId = location.state?.postId;
  const postIdOrCode = postId || postCode;
  const versionParam = version || "main";

  const {
    data = { data: {}, is_saved: false },
    isLoading,
    isFetching,
    error,
  } = useQuery<{ data: any; is_saved: boolean }, Error>({
    queryKey: ["detailPost", section, postIdOrCode, versionParam],
    queryFn: () => fetchPostDetail(section, postIdOrCode, versionParam),
  });

  const orderedData = useMemo(() => {
    if (!data || !data.data) return null;
    return postDetailByPriority(
      data.data,
      POST_DETAILS_PRIORITY[section] || []
    );
  }, [data, section]);

  return (
    <DataStateWrapper
      isLoading={isLoading || isFetching}
      error={error}
      data={orderedData} 
      emptyCondition={(data) => !data || Object.keys(data).length === 0}
      skipLoadingUI={true}
    >
      {(validData) => (
        <div className="flex flex-col gap-3 items-center relative min-h-screen">
          <div className="self-end flex gap-2 items-center justify-center z-10">
            <Info />
            <Bookmark section={section} postId={postIdOrCode} isSaved={data.is_saved} />
          </div>
          <PostDetailItem data={validData} />
        </div>
      )}
    </DataStateWrapper>
  );
};

export default PostDetail;
