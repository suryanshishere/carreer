import { startCase } from "lodash";
import { excludedKeys } from "../post-render-define";
import { renderDateStrNum } from "../../../../shared/ui/render-date-str-num";

export const bgColors = [
  "bg-red-100",
  "bg-blue-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-purple-100",
  "bg-pink-100",
  "bg-gray-100",
];

// Select a random color from the array

export const renderArrayTable = (value: any, key: string) => {
  if (
    Array.isArray(value) &&
    value.length > 0 &&
    typeof value[0] === "object"
  ) {
    const headers = Object.keys(value[0]).filter(
      (header) => !excludedKeys.includes(header)
    );

    return (
      <table className="border-collapse border-2 border-custom-gray w-full mt-3">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} className="border-2 border-custom-gray px-2 py-1">
                {startCase(header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {value.map((item, rowIndex) => {
            const randomBgColor = bgColors[rowIndex % bgColors.length];
            return (
              <tr key={rowIndex}>
                {headers.map((header) => (
                  <td
                    key={header}
                    className={`border-2 border-custom-gray px-2 py-1 ${randomBgColor}`}
                  >
                    {renderDateStrNum(item[header], key)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
};
