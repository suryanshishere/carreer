import React from "react";
import axiosInstance from "shared/utils/api/axios-instance";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Bookmark from "posts/shared/Bookmark";
import PostDetailItem from "posts/components/post-detail";
import Info from "posts/components/post-detail/Info";
import postDetailByPriority from "../components/post-detail/post-detail-by-priority";
import DataStateWrapper from "shared/utils/DataStateWrapper";
import { ISectionKey } from "posts/db";
import PostApproval from "admin/shared/PostApproval";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";

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
  const role = useSelector((state: RootState) => state.user.role);
  const location = useLocation();
  const postId = location.state?.postId;
  const postIdOrCode = postId ?? postCode;

  const {
    data = { data: {}, is_saved: false },
    isLoading,
    isFetching,
    error,
  } = useQuery<{ data: any; is_saved: boolean }, Error>({
    //using data as any since have render for any types
    queryKey: ["detailPost", section, postIdOrCode, version],
    queryFn: () =>
      section
        ? fetchPostDetail(section, postIdOrCode, version)
        : Promise.reject(new Error("Invalid section")),
    enabled: !!section,
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
        {orderedData && role !== "none" && role !== "publisher" && (
          <PostApproval
            approved={orderedData[`${section}_approved`]}
            postId={orderedData._id}
          />
        )}
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
