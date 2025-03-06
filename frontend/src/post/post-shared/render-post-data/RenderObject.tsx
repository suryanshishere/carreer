import React from "react";
import { startCase } from "lodash";
import { excludedKeys } from "post/post-db";
import renderData from ".";
import { SquareUI } from "shared/ui";

interface RenderObjectProps {
  value: any;
  parentKey: string;
}

const RenderObject: React.FC<RenderObjectProps> = ({ value, parentKey }) => {
  return (
    <div className="w-full flex flex-col items-start gap-4">
      {Object.entries(value).map(([subKey, subValue]) => {
        if (excludedKeys.includes(subKey)) {
          return null;
        }

        const fullKey = parentKey ? `${parentKey}.${subKey}` : subKey;

        return (
          <div key={subKey} className="w-full flex flex-col justify-start">
            <h2 className="self-start flex items-center justify-start gap-2 text-custom_gray">
              <SquareUI />
              {startCase(subKey)}
            </h2>
            <div className="pl-5 w-full">{renderData(fullKey, subValue)}</div>
          </div>
        );
      })}
    </div>
  );
};

export default RenderObject;
