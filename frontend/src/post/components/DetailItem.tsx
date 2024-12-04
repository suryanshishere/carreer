import React from "react";
import { startCase } from "lodash";
import { ILatestJob } from "models/postModels/sectionInterfaces/ILatestJob";
import { renderValue } from "shared/ui/renderData/render-data";

interface DetailItemProps {
  data: ILatestJob | {};
}

export const excludedKeys = [
  "_id",
  "created_by",
  "createdAt",
  "updatedAt",
  "contributors",
];

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
    <div className="flex gap-3">
      <div className="w-full flex flex-col gap-4">
        {Object.entries(data).map(([key, value], index) => {
          if (excludedKeys.includes(key)) {
            return null;
          }

          return (
            <div
              key={index}
              className="detail_topic flex flex-col gap-1 w-full"
            >
              <h2 className="self-start font-bold capitalize">
                {startCase(key)}
              </h2>
              <div className="flex flex-col gap-3">
                {renderValue(value, key)}
              </div>
              <hr />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DetailItem;
