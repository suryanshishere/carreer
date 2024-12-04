import React from "react";
import { startCase } from "lodash";
import { ILatestJob } from "models/postModels/sectionInterfaces/ILatestJob";
import { renderValue } from "shared/ui/renderData/render-data";

interface DetailItemProps {
  data: ILatestJob;
}

export const excludedKeys = [
  "_id",
  "created_by",
  "createdAt",
  "updatedAt",
  "contributors",
];

export const notDisplayKeys = [
]

// "common"
export const tableRequired = [
  "age_criteria",
  "male",
  "female",
  "other",
  "category_wise",
  "important_links",
  "important_dates",
  "eligibility",
  "applicants",
];

const DetailItem: React.FC<DetailItemProps> = ({ data }) => {
  return (
      <div className="w-full flex flex-col gap-8">
        {Object.entries(data).map(([key, value], index) => {
          if (excludedKeys.includes(key)) {
            return null;
          }

          return (
            <div
              key={index}
              className="flex flex-col gap-1 w-full text-base"
            >
            <h2 className="self-start font-bold text-custom-red w-full flex items-end gap-2">
                {startCase(key)}
                <hr className="flex-1 border-t-[2px] mb-1 border-custom-less-gray" />
              </h2>
              
              <div className="flex flex-col gap-3 ">
                {renderValue(value, key)}
              </div>
              {/* <hr /> */}
            </div>
          );
        })}
      </div>
  );
};

export default DetailItem;
