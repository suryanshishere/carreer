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

  const orderData = rearrangeObjectByPriority(
    data.data as ILatestJob,
    priorityKeys
  );

  return (
    <div className="flex flex-col items-center">
      {/* <DetailItemHeader /> */}
      {/* <h3>postId</h3> */}
      <Bookmark section={section} postId={postId} isSaved={data.is_saved} />
      {data && <DetailItem data={orderData as ILatestJob} />}
    </div>
  );
};

export default PostDetail;

const priorityKeys = [
  "name_of_the_post",
  "common.short_information",
  "common.department",
  "common.stage_level",
  "common.eligibility",
  "common.applicants",
  "common.age_criteria",
  "common.vacancy",
  "how_to_fill_the_form",
  "important_dates",
  "important_links",
  "application_fee",
];

const rearrangeObjectByPriority = (
  data: ILatestJob,
  priorityKeys: string[]
) => {
  let result: { [key: string]: any } = {};

  priorityKeys.forEach((key) => {
    const keys = key.split("."); // Split by dot for nested keys
    let value: any = data;

    // Traverse nested keys
    keys.forEach((subKey) => {
      value = value ? value[subKey] : undefined;
    });

    // If a value is found, add it to the result and remove the key from data
    if (value !== undefined) {
      result[keys[keys.length - 1]] = value;

      // Remove the key(s) from the original data object
      let currentData: any = data;
      keys.forEach((subKey, index) => {
        if (index === keys.length - 1) {
          delete currentData[subKey]; // Delete the final key
        } else {
          currentData = currentData[subKey]; // Traverse deeper if it's a nested structure
        }
      });
    }
  });

  // Add the rest of the keys that are not in the priority list
  Object.keys(data).forEach((key) => {
    if (!priorityKeys.includes(key)) {
      result[key] = data[key as keyof ILatestJob];
    }
  });

  return result;
};
