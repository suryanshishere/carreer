import React from "react";
import axiosInstance from "shared/utils/api/axios-instance";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useQueryStates from "shared/hooks/query-states-hook";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import Bookmark from "shared/components/Bookmark";
import { ILatestJob } from "models/postModels/sectionInterfaces/ILatestJob";
import DetailItem from "post/components/DetailItem";

const fetchPostDetail = async (
  section: string,
  postId: string,
  token?: string
): Promise<{ data: ILatestJob; is_saved: boolean }> => {
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
  } = useQuery<{ data: ILatestJob; is_saved: boolean }, Error>({
    queryKey: ["detailPost"],
    queryFn: () => fetchPostDetail(section, postId, token),
  });

  const queryStateMessage = useQueryStates({
    isLoading,
    error: error ? error.message : null,
    empty: Object.keys(data.data).length === 0,
  });

  if (queryStateMessage) return queryStateMessage;

  console.log(data);

  return (
    <div className="flex flex-col items-center">
      {/* <DetailItemHeader /> */}
      {/* <h3>postId</h3> */}
      <Bookmark section={section} postId={postId} isSaved={data.is_saved} />
      {data && <DetailItem data={data.data} />}
    </div>
  );
};

export default PostDetail;
