import React from "react";
import { IContributionDetails } from "user/pages/account/MyContribution";
import { startCase } from "lodash";
import SubContriHeader from "./header";
import SubContriValue from "./value";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";

const MyContriComponent: React.FC<{ data: IContributionDetails }> = ({
  data,
}) => {
  const { isEditContribute } = useSelector((state: RootState) => state.post);
  return (
    <div className="flex flex-col gap-2">
      {Object.entries(data).map(([postCode, value], index) => (
        <>
          <div key={postCode} className="flex flex-col gap-2">
            <h2>{startCase(postCode)}</h2>
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
          </div>
          {Object.keys(data).length - 1 !== index && (
            <hr className="col-span-full" />
          )}
        </>
      ))}
    </div>
  );
};

export default MyContriComponent;
