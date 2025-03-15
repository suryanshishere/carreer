import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { startCase } from "lodash";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "shared/utils/api/axios-instance";
import POST_DB from "posts/db";
import PageHeader from "shared/ui/PageHeader";
import Button from "shared/utils/form/Button";
import Para from "shared/ui/Para";
import DataStateWrapper from "shared/utils/DataStateWrapper";
import renderPostData from "posts/shared/render-post-data";

const ContributionSection = () => {
  const navigate = useNavigate();
  const { section: selectedSection } = useParams<{ section?: string }>();

  const handleSectionClick = useCallback(
    (section: string) => {
      if (selectedSection !== section) {
        navigate(`/approver/contributions-section/${section}`);
      }
    },
    [selectedSection, navigate]
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["contributionTrends", selectedSection],
    queryFn: async () => {
      if (!selectedSection) return { data: [] };
      const response = await axiosInstance.get(
        `/admin/approver/contri-post-codes/${selectedSection}`
      );
      return response.data;
    },
    enabled: !!selectedSection,
    retry: 3,
  });

  return (
    <div className="flex flex-col">
      <PageHeader
        header="Contribution Section"
        subHeader="Select a section to view its contributions"
      />
      <div className="flex flex-col gap-5 justify-start">
        <ul className="flex flex-wrap gap-2">
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
        </ul>

        <div className="flex-1 overflow-y-auto">
          {selectedSection ? (
            <DataStateWrapper
              isLoading={isLoading}
              error={error}
              data={data?.data}
              emptyCondition={(data) => !data || data.length === 0}
              skipLoadingUI={false}
              nodelay
            >
              {(validData) => (
                <div className="w-full h-full flex items-start">
                  {renderPostData("contributionTrends", validData)}
                </div>
              )}
            </DataStateWrapper>
          ) : (
            <Para
              header="Select the section"
              subHeader="(Under which you want to fetch the contributed posts)"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ContributionSection;
