import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { startCase } from "lodash";
import POST_DB from "post/post-db";
import PageHeader from "shared/ui/PageHeader";
import ContributionTrends from "./ContributeTrends";
import Button from "shared/utils/form/Button";

const ContributionSection = () => {
  const navigate = useNavigate();
  // Retrieve the section parameter from the URL (if present)
  const { section: selectedSection } = useParams<{ section?: string }>();

  const handleSectionClick = useCallback(
    (section: string) => {
      if (selectedSection !== section) {
        // Navigate to the new URL with the section as a path parameter
        navigate(`/approver/contributions-section/${section}`);
      }
    },
    [selectedSection, navigate]
  );

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
              classProp={`min-w-fit max-w-fit text-sm ${
                selectedSection === item ? "bg-custom_pale_yellow" : ""
              }`}
            >
              {startCase(item)}
            </Button>
          ))}
        </ul>

        <div className="flex-1 overflow-y-auto">
          {selectedSection ? (
            <ContributionTrends section={selectedSection} />
          ) : (
            <p className="min-h-40 w-full flex flex-col items-center justify-center text-center">
              <span className="text-xl font-semibold">Select the section </span> 
              <span>(under which you want to fetch the contributed post)</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContributionSection;
