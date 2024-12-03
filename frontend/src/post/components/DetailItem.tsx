import React from "react";
import { startCase } from "lodash";
import { ILatestJob } from "models/postModels/sectionInterfaces/ILatestJob";
import { ILinks } from "models/postModels/overallInterfaces/ILinks";
import { IDates } from "models/postModels/overallInterfaces/IDates";

interface DetailItemProps {
  data: ILatestJob | {};
}

const renderValue = (value: any, key: string) => {
  if (key === "important_dates" && value && typeof value === "object") {
    return (
      <td colSpan={2} className="border border-gray-300 px-2 py-1">
        <table className="w-full">
          <tbody>
            {Object.entries(value as IDates).map(([subKey, subValue]) => (
              <tr key={subKey}>
                <td className="border border-gray-300 px-2 py-1">
                  {startCase(subKey)}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {subValue.current_year != null ||
                  typeof subValue === "string" ? (
                    <a
                      href={subValue}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {subValue.current_year || subValue}
                    </a>
                  ) : (
                    renderValue(subValue, subKey || "important_dates")
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </td>
    );
  }
  if (
    (key === "important_links" || key === "application_fee") &&
    value &&
    typeof value === "object"
  ) {
    return (
      <td colSpan={2} className="border border-gray-300 px-2 py-1">
        <table className="w-full">
          <tbody>
            {Object.entries(value).map(([subKey, subValue]) => (
              <tr key={subKey}>
                <td className="border border-gray-300 px-2 py-1">
                  {startCase(subKey)}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {typeof subValue === "string" ? (
                    <a
                      href={subValue}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {subValue}
                    </a>
                  ) : typeof subValue === "number" ? (
                    subValue.toString()
                  ) : (
                    renderValue(subValue, "important_links")
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </td>
    );
  }

  return null;
};

const DetailItem: React.FC<DetailItemProps> = ({ data }) => {
  return (
    <div className="flex gap-3">
      <div className="w-full flex flex-col gap-4">
        {Object.entries(data).map(([key, value], index) => (
          <div key={index} className="detail_topic flex flex-col gap-1 w-full">
            <h5 className="self-start font-bold capitalize">
              {startCase(key)}
            </h5>
            <div className="flex flex-col gap-3">{renderValue(value, key)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailItem;
