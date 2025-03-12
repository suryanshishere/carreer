import React from "react";
import axiosInstance from "shared/utils/api/axios-instance";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Bookmark from "post/post-shared/Bookmark";
import PostDetailItem from "post/post-components/post-detail";
import Info from "post/post-components/post-detail/Info";
import postDetailByPriority from "../post-components/post-detail/post-detail-by-priority";
import DataStateWrapper from "shared/utils/DataStateWrapper";
import { ISectionKey } from "post/post-db";

const fetchPostDetail = async (
  section: ISectionKey,
  postIdOrCode: string,
  version: string
): Promise<{ data: any; is_saved: boolean }> => {
  const { data } = await axiosInstance.get(
    `/public/sections/${section}/${postIdOrCode}/${version}`
  );
  return data;
};

const PostDetail: React.FC = () => {
  const {
    section,
    postCode = "",
    version = "main",
  } = useParams<{
    section: ISectionKey;
    postCode: string;
    version: string;
  }>();

  const location = useLocation();
  const postId = location.state?.postId;
  const postIdOrCode = postId ?? postCode;

  const {
    data = { data: {}, is_saved: false },
    isLoading,
    isFetching,
    error,
  } = useQuery<{ data: any; is_saved: boolean }, Error>({
    queryKey: ["detailPost", section, postIdOrCode, version],
    queryFn: () =>
      section
        ? fetchPostDetail(section, postIdOrCode, version)
        : Promise.reject(new Error("Invalid section")),
    enabled: !!section, // Prevents query execution if section is undefined
  });

  const orderedData = section ? postDetailByPriority(data.data, section) : null;
  return (
    <div className="flex flex-col gap-3 relative min-h-screen">
      <div className="self-end flex gap-2 items-center justify-center z-10">
        <Info />
        <Bookmark
          section={section as ISectionKey}
          postId={postIdOrCode}
          isSaved={data.is_saved}
        />
      </div>
      <DataStateWrapper
        isLoading={isLoading || isFetching || !orderedData}
        error={error || (!section ? new Error("Invalid section") : null)}
        data={orderedData}
        emptyCondition={(data) => !data || Object.keys(data).length === 0}
        skipLoadingUI={true}
      >
        {(validData: any) => <PostDetailItem data={validData} />}
      </DataStateWrapper>
    </div>
  );
};

export default PostDetail;
