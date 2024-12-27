import { startCase } from "lodash";
import { ICommon } from "models/postModels/overallInterfaces/ICommon";
import { IDates } from "models/postModels/overallInterfaces/IDates";
import { IFees } from "models/postModels/overallInterfaces/IFees";
import { ILinks } from "models/postModels/overallInterfaces/ILinks";
import { excludedKeys } from "./post-detail-render-define";
import { renderValue } from "./render-data";
import  RenderDateStrNum  from "../../shared/utils/render-date-str-num";

export const renderObject = (value: any, parentKey: string) => (
  <div className="w-full flex flex-col gap-4 pt-3 pl-4">
    {Object.entries(value as IDates | ILinks | IFees | ICommon).map(
      ([subKey, subValue]) => {
        if (excludedKeys.includes(subKey)) {
          return null;
        }

        const fullKey = parentKey ? `${parentKey}.${subKey}` : subKey;

        return (
          <div key={subKey} className="flex flex-col gap-1">
            <h2 className="flex items-center gap-2 font-semibold text-custom-gray text-lg">
              <div className="w-2 h-2 bg-custom-gray rounded-sm"></div>
              {startCase(subKey)}
            </h2>

            <div className="pl-4">
              {(subValue?.current_year || subValue?.previous_year) != null ? (
                <p>
                  {RenderDateStrNum(
                    subValue.current_year || subValue.previous_year,
                    `${fullKey}.current_year` 
                  )}
                </p>
              ) : (
                renderValue(subValue, fullKey)
              )}
            </div>
          </div>
        );
      }
    )}
  </div>
);
