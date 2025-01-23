import { excludedKeys } from "./post-detail-render-define";
import { ICommon } from "models/postModels/overallInterfaces/ICommon";
import { IDates } from "models/postModels/overallInterfaces/IDates";
import { IFees } from "models/postModels/overallInterfaces/IFees";
import { ILinks } from "models/postModels/overallInterfaces/ILinks";
import { startCase } from "lodash"; 
import RenderPostDetail from "post/components/postDetails/RenderPostDetail";



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


const renderTable = (value: any, key: string) => {
  if (excludedKeys.includes(key)) return null;

  if (value != null && typeof value === "object" && !Array.isArray(value)) {
    return (
      <table className="border-collapse border border-custom-gray w-full">
        <tbody>
          {Object.entries(value as IDates | ILinks | IFees | ICommon).map(
            ([subKey, subValue], index) => {
              if (excludedKeys.includes(subKey)) {
                return null;
              }
              const randomBgColor = bgColors[index % bgColors.length];
              const fullKey = `${key}.${subKey}`;

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
                    {subValue != null && typeof subValue === "object" ? (
                      subValue.current_year || subValue.previous_year ? (
                        <RenderPostDetail
                          value={`${
                            subValue.current_year || subValue.previous_year
                          }`}
                          keyProp={`${fullKey}.current_year`}
                        />
                      ) : (
                        renderTable(subValue, fullKey)  
                      )
                    ) : (
                      <RenderPostDetail value={subValue} keyProp={fullKey} />
                    )}
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

export default renderTable;
