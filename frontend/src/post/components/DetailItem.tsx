import React from "react";
import { startCase } from "lodash";
import { ILatestJob } from "models/postModels/sectionInterfaces/ILatestJob";
import { ILinks } from "models/postModels/overallInterfaces/ILinks";
import { IDates } from "models/postModels/overallInterfaces/IDates";
import { IFees } from "models/postModels/overallInterfaces/IFees";
import moment from "moment";
import { ICommon } from "models/postModels/overallInterfaces/ICommon";

interface DetailItemProps {
  data: ILatestJob | {};
}

const excludedKeys = [
  "_id",
  "created_by",
  "createdAt",
  "updatedAt",
  "contributors",
];

const tableRequired = [
  "age_criteria",
  "male",
  "female",
  "other",
  "category_wise",
  "important_links",
  "important_dates",
  "eligibility",
  "applicants"
];

const renderTable = (value: any, key: string) => {

  if (excludedKeys.includes(key)) return null;

  if (value && (typeof value === "number" || typeof value === "string")) {
    return (
      <div>
        {moment(value).isValid()
          ? moment(value).format("Do MMMM YYYY")
          : value.toString()}
      </div>
    );
  }
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return (
      <div>
        {Object.entries(value as IDates | ILinks | IFees | ICommon).map(
          ([subKey, subValue]) => {
            if (excludedKeys.includes(subKey)) {
              return null;
            }

            return (
              <tr key={subKey}>
                <td className="border border-gray-300 px-2 py-1">
                  {startCase(subKey)}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {typeof subValue === "string" &&
                  subValue.startsWith("https://") ? (
                    <a
                      href={subValue}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline font-bold"
                    >
                      Click here
                    </a>
                  ) : subValue?.current_year != null ? (
                    <p>
                      {moment(subValue.current_year).isValid()
                        ? moment(subValue.current_year).format("Do MMMM YYYY")
                        : subValue.current_year}
                    </p>
                  ) : typeof subValue === "string" ||
                    typeof subValue === "number" ? (
                    <p>
                      {moment(subValue).isValid()
                        ? moment(subValue).format("Do MMMM YYYY")
                        : subValue.toString()}
                    </p>
                  ) : (
                    renderTable(subValue, subKey)
                  )}
                </td>
              </tr>
            );
          }
        )}
      </div>
    );
  }

  // Return null if value is not a valid object or array
  return null;
};

const renderValue = (value: any, key: string) => {
  if (
    Array.isArray(value) &&
    value.length > 0 &&
    typeof value[0] === "object"
  ) {
    const headers = Object.keys(value[0]).filter(
      (header) => !excludedKeys.includes(header)
    );

    return (
      <table className="border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} className="border border-gray-300 px-2 py-1">
                {startCase(header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {value.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header) => (
                <td key={header} className="border border-gray-300 px-2 py-1">
                  {typeof item[header] === "string" &&
                  item[header].startsWith("https://") ? (
                    <a
                      href={item[header]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {item[header]}
                    </a>
                  ) : moment(item[header]).isValid() ? (
                    moment(item[header]).format("Do MMMM YYYY")
                  ) : (
                    item[header]?.toString() || "-"
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  if (tableRequired.includes(key) && value && typeof value === "object") {
    if (excludedKeys.includes(key)) {
      return null; 
    }

    return renderTable(value, key);
  }

  if (value && typeof value === "object") {
    return (
      <td colSpan={2} className="border border-gray-300 px-2 py-1">
        <div className="w-full">
          {Object.entries(value as IDates | ILinks | IFees | ICommon).map(
            ([subKey, subValue]) => {
              if (excludedKeys.includes(subKey)) {
                return null;
              }

              return (
                <div key={subKey} className="flex flex-col gap-1">
                  <div className="px-2 py-1 text-xl font-bold">
                    {startCase(subKey)}
                  </div>
                  <div className="">
                    {typeof subValue === "string" &&
                    subValue.startsWith("https://") ? (
                      <a
                        href={subValue}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline font-bold"
                      >
                        Click here
                      </a>
                    ) : subValue?.current_year != null ? (
                      <p>
                        {moment(subValue.current_year).isValid()
                          ? moment(subValue.current_year).format("Do MMMM YYYY")
                          : subValue.current_year}
                      </p>
                    ) : typeof subValue === "string" ||
                      typeof subValue === "number" ? (
                      <p>
                        {moment(subValue).isValid()
                          ? moment(subValue).format("Do MMMM YYYY")
                          : subValue.toString()}
                      </p>
                    ) : (
                      renderValue(subValue, subKey)
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </td>
    );
  }

  if (value && (typeof value === "number" || typeof value === "string")) {
    return (
      <div>
        {moment(value).isValid()
          ? moment(value).format("Do MMMM YYYY")
          : value.toString()}
      </div>
    );
  }

  return null;
};

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
              <h5 className="self-start font-bold capitalize">
                {startCase(key)}
              </h5>
              <div className="flex flex-col gap-3">
                {renderValue(value, key)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DetailItem;
