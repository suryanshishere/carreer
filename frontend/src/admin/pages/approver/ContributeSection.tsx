import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { startCase } from "lodash";
import POST_DB from "posts/db";
import PageHeader from "shared/ui/PageHeader";
import ContributionTrends from "./ContributeTrends";
import Button from "shared/utils/form/Button";
import Para from "shared/ui/Para";

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
            <Para
              header="Select the section"
              subHeader="under which you want to fetch the contributed posts"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ContributionSection;
