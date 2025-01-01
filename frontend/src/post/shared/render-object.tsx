import { startCase } from "lodash";
import { ICommon } from "models/postModels/overallInterfaces/ICommon";
import { IDates } from "models/postModels/overallInterfaces/IDates";
import { IFees } from "models/postModels/overallInterfaces/IFees";
import { ILinks } from "models/postModels/overallInterfaces/ILinks";
import { excludedKeys } from "./post-detail-render-define";
import RenderPostDetail from "post/components/RenderPostDetail";
import renderData from "./render-data";

const renderObject = (value: any, parentKey: string) => (
  <div className="w-full flex flex-col items-start gap-4 pt-3 pl-4">
    {Object.entries(value as IDates | ILinks | IFees | ICommon).map(
      ([subKey, subValue]) => {
        if (excludedKeys.includes(subKey)) {
          return null;
        }

        const fullKey = parentKey ? `${parentKey}.${subKey}` : subKey;

        return (
          <div key={subKey} className="flex flex-col justify-start">
            <h2 className="self-start flex items-center justify-start gap-2 text-custom-gray">
              <div className="w-2 h-2 bg-custom-gray rounded-sm"></div>
              {startCase(subKey)}
            </h2>

            <div className="ml-5 self-start">
              {(subValue?.current_year || subValue?.previous_year) != null ? (
                <p>
                  <RenderPostDetail
                    value={subValue.current_year || subValue.previous_year}
                    keyProp={`${fullKey}.current_year`}
                  />
                </p>
              ) : (
                // : typeof subValue === "object" && subValue !== null ? (
                //   <>{renderObject(subValue, fullKey)}</>
                // )
                <>{renderData(subValue, fullKey)}</>
              )}
            </div>
          </div>
        );
      }
    )}
  </div>
);

export default renderObject;
