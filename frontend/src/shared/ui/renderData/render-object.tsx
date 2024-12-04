import { startCase } from "lodash";
import { ICommon } from "models/postModels/overallInterfaces/ICommon";
import { IDates } from "models/postModels/overallInterfaces/IDates";
import { IFees } from "models/postModels/overallInterfaces/IFees";
import { ILinks } from "models/postModels/overallInterfaces/ILinks";
import moment from "moment";
import { excludedKeys } from "post/components/DetailItem";
import { renderValue } from "./render-data";
import { renderDateStrNum } from "./render-date-str-num";

export const renderObject = (value: any, key: string) => (
  <div>
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
                {subValue?.current_year != null ? (
                  <p>{renderDateStrNum(subValue.current_year, key)}</p>
                ) : (
                  renderValue(subValue, subKey)
                )}
              </div>
            </div>
          );
        }
      )}
    </div>
  </div>
);
