import React, { useCallback, useState } from "react";
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
import Toggle from "shared/utils/form/Toggle";

const NonApprovedPosts: React.FC = () => {
  const navigate = useNavigate();
  const { section: selectedSection } = useParams<{ section?: string }>();
  const [isActive, setIsActive] = useState(false);

  const handleSectionClick = useCallback(
    (section: string) => {
      if (selectedSection !== section) {
        navigate(`/approver/non-approved-posts/${section}`);
      }
    },
    [selectedSection, navigate]
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["nonApprovedPosts", selectedSection, isActive],
    queryFn: async () => {
      if (!selectedSection) return null;
      const url = `/admin/approver/non-approved-posts/${selectedSection}${
        isActive ? "/active" : ""
      }`;
      const response = await axiosInstance.get(url);
      return response.data.data;
    },
    enabled: !!selectedSection,
    retry: 3,
  });

  return (
    <div className="w-full flex flex-col gap-3">
      <PageHeader
        header="Non-Approved Posts"
        subHeader="Posts which are yet to be approved"
      />

      <div className="flex items-center flex-wrap gap-2">
        {POST_DB.sections.map((item) => (
          <Button
            key={item}
            onClick={() => handleSectionClick(item)}
            className={`min-w-fit max-w-fit text-sm ${
              selectedSection === item ? "bg-custom_pale_yellow" : ""
            }`}
          >
            {startCase(item)}
          </Button>
        ))}

        <Toggle
          checked={isActive}
          onChange={() => {
            setIsActive((prev) => !prev);
          }}
          tooltip="Fetch current active posts"
          label="Active"
          labelClassName="w-20"
          dotActiveClassName="translate-x-14"
        />
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
            {(data) => (
              <PostList data={data} section={selectedSection as ISectionKey} />
            )}
          </DataStateWrapper>
        ) : (
          <Para
            header="Select the section"
            subHeader="(Under which you want to fetch the non-approved posts list)"
          />
        )}
      </div>
    </div>
  );
};

export default NonApprovedPosts;
