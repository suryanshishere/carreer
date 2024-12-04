import { startCase } from "lodash";
import { excludedKeys } from "post/components/DetailItem";
import { renderDateStrNum } from "./render-date-str-num";

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
      <div className="flex flex-col ">
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
                    {renderDateStrNum(item[header], key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
};
