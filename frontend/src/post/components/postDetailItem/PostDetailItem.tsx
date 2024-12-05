import React from "react";
import { startCase } from "lodash";
import { renderValue } from "./renderData/render-data";
import { excludedKeys } from "./post-render-define";
import { IPostDetail } from "models/postModels/IPostDetail";

interface DetailItemProps {
  data: IPostDetail;
}

const PostDetailItem: React.FC<DetailItemProps> = ({ data }) => {
  return (
    <div className="w-full flex flex-col gap-8">
      {Object.entries(data).map(([key, value], index) => {
        if (excludedKeys.includes(key)) {
          return null;
        }

        return (
          <div key={index} className="flex flex-col gap-1 w-full text-base">
            <h2 className="self-start font-bold text-custom-red w-full flex items-end gap-[6px]">
              {startCase(key)}
              <hr className="flex-1 border-t-[1px] mb-1 border-custom-less-gray" />
            </h2>
            <div className="flex flex-col gap-3 pl-2">
              {renderValue(value, key)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostDetailItem;
