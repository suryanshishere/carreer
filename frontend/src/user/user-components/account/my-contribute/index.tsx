import React from "react";
import { startCase } from "lodash";
import SubContriHeader from "./SubContriHeader";
import SubContriValue from "./SubContriValue";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Collapse from "@mui/material/Collapse";
import { IContributionDetails } from "user/user-pages/account/MyContribution";
import { ISectionKey } from "post/db";

const MyContriComponent: React.FC<{ data: IContributionDetails }> = ({
  data,
}) => {
  const { isEditContribute } = useSelector((state: RootState) => state.post);

  const postCodes = Object.keys(data);

  // Set the first item expanded by default, others collapsed.
  const initialExpandedState = postCodes.reduce(
    (acc, code, index) => {
      acc[code] = index === 0;
      return acc;
    },
    {} as Record<string, boolean>
  );

  const [expandedSections, setExpandedSections] =
    React.useState<Record<string, boolean>>(initialExpandedState);

  const handleToggle = (postCodeVersion: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [postCodeVersion]: !prev[postCodeVersion],
    }));
  };

  return (
    <div className="flex flex-col gap-2">
      {Object.entries(data).map(([postCodeVersion, value]) => {
const [postCode, version = "main"] = postCodeVersion.split("_1_");

        return (
          <div key={postCodeVersion} className="flex flex-col gap-2">
            <h2
              onClick={() => handleToggle(postCodeVersion)}
              className="py-1 cursor-pointer self-start text-custom_red"
            >
              { startCase(postCode)} / { startCase(version)}
              {expandedSections[postCodeVersion] ? (
                <ArrowDropUpIcon />              ) : (
                <ArrowDropDownIcon />
              )}
            </h2>
            <Collapse
              in={expandedSections[postCodeVersion]}
              timeout="auto"
              unmountOnExit
            >
              <div className="flex flex-col gap-2">
                {Object.entries(value).map(([section, subValue]) => {
                  const isEditing =
                    isEditContribute.clicked &&
                    isEditContribute.section === section &&
                    isEditContribute.postCode === postCode;

                  return (
                    <div key={section} className="flex flex-col gap-2">
                      <SubContriHeader
                        section={section as ISectionKey}
                        postCode={postCode}
                        version={version}
                        isEditing={isEditing}
                      />
                      <SubContriValue subValue={subValue} isEditing={isEditing} />
                    </div>
                  );
                })}
              </div>
            </Collapse>
          </div>
        );
      })}
    </div>
  );
};

export default MyContriComponent;
