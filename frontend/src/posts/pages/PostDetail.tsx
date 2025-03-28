import React from "react";
import axiosInstance from "shared/utils/api/axios-instance";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Bookmark from "posts/shared/Bookmark";
import PostDetailItem from "posts/components/post-detail";
import Info from "posts/components/post-detail/Info";
import DataStateWrapper from "shared/utils/DataStateWrapper";
import { ISectionKey } from "posts/db";
import PostApproval from "admin/shared/PostApproval";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import { ParaSkeletonLoad, TableSkeletonLoad } from "posts/shared/SkeletonLoad";

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

  const isEditPostClicked = useSelector(
    (state: RootState) => state.post.isEditPostClicked
  );
  const role = useSelector((state: RootState) => state.user.role);
  const location = useLocation();
  const postIdOrCode = location.state?.postId ?? postCode;

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["detailPost", section, postIdOrCode, version],
    queryFn: async () => {
      if (!section) throw new Error("Invalid section");
      const response = await axiosInstance.get(
        `/public/sections/${section}/${postIdOrCode}/${version}`
      );
      return response.data;
    },
    enabled: Boolean(section),
    staleTime: 5 * 60 * 1000,
  });

  const isSaved = data?.is_saved ?? false;
  const postData = data?.data ?? {};
  const isEmpty = Object.keys(postData).length === 0;

  return (
    <div className="flex flex-col gap-3 relative min-h-screen">
      <div className="self-end flex gap-2 items-center justify-center z-10">
        <Info />
        <Bookmark
          section={section as ISectionKey}
          postId={postIdOrCode}
          isSaved={isSaved}
        />
        {role !== "none" && role !== "publisher" && postData._id && (
          <PostApproval
            approved={postData[`${section}_approved`]}
            postId={postData._id}
          />
        )}
      </div>
      {isEditPostClicked && (
        <ul className="custom_ul text-sm text-custom_gray bg-custom_pale_yellow outline outline-custom_less_gray py-2 pr-1 pl-4 my-2 rounded">
          <li>
            Provide accurate and well-structured data to enhance the chances of
            contribution acceptance.
          </li>
          <li>
            Adding new information will appear alongside the existing data.
          </li>
          <li>
            Ensure proper structuring for better readability and organization.
          </li>
        </ul>
      )}

      <DataStateWrapper
        isLoading={isLoading || isFetching}
        error={error}
        data={postData}
        emptyCondition={() => isEmpty}
        nodelay={true}
        loadingComponent={
          <div className="w-full flex flex-col gap-3 animate-pulse">
            {[...Array(3)].map((_, index) => (
              <ParaSkeletonLoad key={index} />
            ))}
            <TableSkeletonLoad />
            {[...Array(3)].map((_, index) => (
              <ParaSkeletonLoad key={index} />
            ))}
          </div>
        }
      >
        {(validData) => <PostDetailItem data={validData} />}
      </DataStateWrapper>
    </div>
  );
};

export default PostDetail;
