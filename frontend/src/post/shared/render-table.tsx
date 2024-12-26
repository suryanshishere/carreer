import moment from "moment";
import { excludedKeys } from "./post-detail-render-define";
import { ICommon } from "models/postModels/overallInterfaces/ICommon";
import { IDates } from "models/postModels/overallInterfaces/IDates";
import { IFees } from "models/postModels/overallInterfaces/IFees";
import { ILinks } from "models/postModels/overallInterfaces/ILinks";
import { startCase } from "lodash";
import  RenderDateStrNum  from "../../shared/utils/render-date-str-num";
import { bgColors } from "./render-array-table";

export const renderTable = (value: any, key: string) => {
  if (excludedKeys.includes(key)) return null;

  if (value != null && typeof value === "object" && !Array.isArray(value)) {
    return (
      <table className="border-collapse border border-custom-gray">
        <tbody>
          {Object.entries(value as IDates | ILinks | IFees | ICommon).map(
            ([subKey, subValue], index) => {
              if (excludedKeys.includes(subKey)) {
                return null;
              }
              const randomBgColor = bgColors[index % bgColors.length];

              return (
                <tr
                  key={subKey}
                  className="border border-custom-gray px-2 py-1"
                >
                  <td className="border-2 border-custom-gray px-2 py-1">
                    {startCase(subKey)}
                  </td>
                  <td
                    className={`border-2 border-custom-gray px-2 py-1 max-w-2/5 ${randomBgColor}`}
                  >
                    {typeof subValue !== "object" && !subValue?.current_year
                      ? RenderDateStrNum(subValue, subKey)
                      : subValue?.current_year || subValue?.previous_year
                      ? RenderDateStrNum(
                          `${
                            subValue.current_year || `${subValue.previous_year}`
                          }`,
                          subKey
                        )
                      : renderTable(subValue, subKey)}
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    );
  }

  // Return null if value is not a valid object or array
  return null;
};
