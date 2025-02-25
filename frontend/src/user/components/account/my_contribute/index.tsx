import React from "react";
import { IContributionDetails } from "user/pages/account/my_contribution";
import { startCase } from "lodash";
import SubContriHeader from "./sub_contri_header";
import SubContriValue from "./sub_contri_value";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

const MyContriComponent: React.FC<{ data: IContributionDetails }> = ({
  data,
}) => {
  const { isEditContribute } = useSelector((state: RootState) => state.post);
  const [expandedSections, setExpandedSections] = React.useState<
    Record<string, boolean>
  >({});
  const toggleExpand = (postCode: string) => {
    setExpandedSections((prev) => ({ ...prev, [postCode]: !prev[postCode] }));
  };
  return (
    <div className="flex flex-col gap-2">
      {Object.entries(data).map(([postCode, value], index) => (
        <React.Fragment key={postCode}>
          <div className="flex flex-col gap-2">
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
                      <SubContriValue
                        subValue={subValue}
                        isEditing={isEditing}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {Object.keys(data).length - 1 !== index && (
            <hr className="col-span-full" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default MyContriComponent;
