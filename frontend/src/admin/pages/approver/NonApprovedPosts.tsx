import React, { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "shared/utils/api/axios-instance";
import PageHeader from "shared/ui/PageHeader";
import Button from "shared/utils/form/Button";
import Para from "shared/ui/Para";
import DataStateWrapper from "shared/utils/DataStateWrapper";
import PostList from "posts/shared/PostList";
import POST_DB, { ISectionKey } from "posts/db";
import { startCase } from "lodash";

const NonApprovedPosts: React.FC = () => {
  const navigate = useNavigate();
  const { section: selectedSection } = useParams<{ section?: string }>();

  const handleSectionClick = useCallback(
    (section: string) => {
      if (selectedSection !== section) {
        navigate(`/approver/non-approved-posts/${section}`);
      }
    },
    [selectedSection, navigate]
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["nonApprovedPosts", selectedSection],
    queryFn: async () => {
      if (!selectedSection) return null;
      const response = await axiosInstance.post("/admin/non-approved-posts", { section: selectedSection });
      return response.data.data;
    },
    enabled: !!selectedSection,
    retry: 3,
  });

  return (
    <div className="w-full flex flex-col">
      <PageHeader header="Non-Approved Posts" subHeader="Select a section to fetch posts" />
      <div className="flex flex-wrap gap-2 mb-5">
        {POST_DB.sections.map((item) => (
          <Button
            key={item}
            onClick={() => handleSectionClick(item)}
            classProp={`min-w-fit max-w-fit text-sm ${selectedSection === item ? "bg-custom_pale_yellow" : ""}`}
          >
            {startCase(item)}
          </Button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        {selectedSection ? (
          <DataStateWrapper
            isLoading={isLoading}
            error={error}
            data={data}
            emptyCondition={(data) => !data || data.length === 0}
            nodelay
          >
            {(data) => <PostList data={data} section={selectedSection as ISectionKey} />}
          </DataStateWrapper>
        ) : (
          <Para header="Select the section" subHeader="(Under which you want to fetch the non-approved posts list)" />
        )}
      </div>
    </div>
  );
};

export default NonApprovedPosts;
