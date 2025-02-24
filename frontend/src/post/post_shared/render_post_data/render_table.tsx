import React from "react";
import { startCase } from "lodash";
import { excludedKeys } from "post/components/post_detail/postDetailsUtils/post-detail-render-define";
import renderPostData from "post/post_shared/render_post_data";

// Background colors for table rows
const bgColors = [
  "bg-custom-pale-yellow",
  "bg-custom-less-gray",
  "bg-custom-less-white",
];

interface RenderTableProps {
  value: any[] | Record<string, any>;
  tableKey: string;
}

const RenderTable: React.FC<RenderTableProps> = ({ value, tableKey }) => {
  if (!value || typeof value !== "object" || excludedKeys.includes(tableKey)) return null;

  const isArray = Array.isArray(value);

  // For arrays, generate headers and rows
  const headers = isArray
    ? Object.keys(value[0] || {}).filter((header) => !excludedKeys.includes(header))
    : [];

  return (
    <table className="my-2 border-collapse border-2 border-custom-gray w-full">
      {isArray && headers.length > 0 && (
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="border-2 border-custom-gray px-2 py-1 md:whitespace-nowrap"
              >
                {startCase(header)}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {isArray
          ? value.map((item, rowIndex) => {
              const randomBgColor = bgColors[rowIndex % bgColors.length];
              return (
                <tr key={rowIndex}>
                  {headers.map((header) => {
                    const fullKey = `${tableKey}[${rowIndex}].${header}`;
                    return (
                      <td
                        key={header}
                        className={`border-2 border-custom-gray px-2 py-1 ${randomBgColor}`}
                      >
                        {renderPostData(fullKey, item[header])}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          : Object.entries(value).map(([subKey, subValue], index) => {
              if (excludedKeys.includes(subKey)) return null;
              const randomBgColor = bgColors[index % bgColors.length];
              const fullKey = `${tableKey}.${subKey}`;
              return (
                <tr key={subKey}>
                  <td className="border-2 border-custom-gray px-2 py-1 font-bold">
                    {startCase(subKey)}
                  </td>
                  <td
                    className={`border-2 border-custom-gray px-2 py-1 max-w-2/5 ${randomBgColor}`}
                  >
                    {renderPostData(fullKey, subValue)}
                  </td>
                </tr>
              );
            })}
      </tbody>
    </table>
  );
};

export default RenderTable;
