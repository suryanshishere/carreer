import React from "react";
import { startCase } from "lodash";
import { excludedKeys } from "../../post/shared/post-detail-render-define";
import RenderPostDetail from "../../post/components/RenderPostDetail";

// Background colors for table rows
export const bgColors = [
  // "bg-custom-less-red",
  "bg-custom-pale-yellow",
  "bg-custom-super-less-gray",
  // "bg-custom-pale-orange",
  "bg-custom-less-white",
  // "bg-purple-100",
  // "bg-pink-100",
  // "bg-gray-100",
];

// Component to generate table headers
const TableHeaders: React.FC<{ headers: string[] }> = ({ headers }) => {
  return (
    <thead>
      <tr>
        {headers.map((header) => (
          <th key={header} className="border-2 border-custom-gray px-2 py-1">
            {startCase(header)}
          </th>
        ))}
      </tr>
    </thead>
  );
};

// Component to generate table rows
const TableRows: React.FC<{
  value: any[];
  headers: string[];
  tableRowKey: string;
}> = ({ value, headers, tableRowKey }) => {
  
  return (
    <tbody>
      {value.map((item, rowIndex) => {
        const randomBgColor = bgColors[rowIndex % bgColors.length];
        return (
          <tr key={rowIndex}>
            {headers.map((header) => {
              const fullKey = `${tableRowKey}[${rowIndex}].${header}`;
              return (
                <td
                  key={header}
                  className={`border-2 border-custom-gray px-2 py-1 ${randomBgColor}`}
                >
                  <RenderPostDetail value={item[header]} keyProp={fullKey} />
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
};

// Main Table Component
const RenderArrayTable: React.FC<{ value: any[]; arrTableKey: string }> = ({ value, arrTableKey }) => {
  if (!value.length) return null; // Handle empty array case

  // Filter headers based on excluded keys
  const headers = Object.keys(value[0]).filter(
    (header) => !excludedKeys.includes(header)
  );

  return (
    <table className="border-collapse border-2 border-custom-gray w-full mt-3">
      <TableHeaders headers={headers} />
      <TableRows value={value} headers={headers} tableRowKey={arrTableKey} />
    </table>
  );
};

export default RenderArrayTable;
