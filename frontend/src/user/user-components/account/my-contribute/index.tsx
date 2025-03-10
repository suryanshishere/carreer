import React from "react";
import { startCase } from "lodash";
import SubContriHeader from "./SubContriHeader";
import SubContriValue from "./SubContriValue";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { IContributionDetails } from "user/user-pages/account/MyContribution";

const MyContriComponent: React.FC<{ data: IContributionDetails }> = ({ data }) => {
  const { isEditContribute } = useSelector((state: RootState) => state.post);

  // Create initial expanded state with the first item expanded by default.
  const postCodes = Object.keys(data);
  const initialExpandedState = postCodes.reduce((acc, code, index) => {
    acc[code] = index === 0; // first item expanded; others collapsed
    return acc;
  }, {} as Record<string, boolean>);

  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>(
    initialExpandedState
  );

  const toggleExpand = (postCode: string) => {
    setExpandedSections((prev) => ({ ...prev, [postCode]: !prev[postCode] }));
  };

  return (
    <div className="flex flex-col gap-2">
      {Object.entries(data).map(([postCode, value]) => (
        <div key={postCode} className="flex flex-col gap-2">
          <h2
            onClick={() => toggleExpand(postCode)}
            className="py-1 cursor-pointer self-start"
          >
            {startCase(postCode)}
            {expandedSections[postCode] ? (
              <ArrowDropUpIcon />
            ) : (
              <ArrowDropDownIcon />
            )}
          </h2>
          {expandedSections[postCode] && (
            <div className="flex flex-col gap-2">
              {Object.entries(value).map(([section, subValue]) => {
                const isEditing =
                  isEditContribute.clicked &&
                  isEditContribute.section === section &&
                  isEditContribute.postCode === postCode;

                return (
                  <div key={section} className="flex flex-col gap-2">
                    <SubContriHeader
                      section={section}
                      postCode={postCode}
                      isEditing={isEditing}
                    />
                    <SubContriValue subValue={subValue} isEditing={isEditing} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyContriComponent;
