import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { startCase } from "lodash";
import POST_DB from "post/post-db";
import PageHeader from "shared/ui/PageHeader";
import ContributionTrends from "./contribution_trends";
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
      <div className="flex flex-col md:flex-row gap-4 justify-start">
        <ul className="flex md:flex-col gap-2 overflow-x-auto p-1 pb-3">
          {POST_DB.sections.map((item) => (
            <Button
              key={item}
              onClick={() => handleSectionClick(item)}
              classProp={`min-w-fit ${
                selectedSection === item ? "bg-custom_pale_yellow" : ""
              }`}
            >
              {startCase(item)}
            </Button>
          ))}
        </ul>

        {selectedSection && (
          <div className="flex-1 overflow-y-auto">
            <ContributionTrends section={selectedSection} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ContributionSection;
