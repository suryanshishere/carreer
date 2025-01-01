import React from "react";
import { startCase } from "lodash";
import { excludedKeys } from "../shared/post-detail-render-define";
import { IPostDetail } from "models/postModels/IPost";
import renderData from "../shared/render-data";

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
            <div className="flex items-end gap-2">
              <h2 className="flex-none text-custom-red">
                {startCase(key)}
              </h2>
              <hr className="mb-3 flex-1" />
            </div>
            <div className="p-1 flex flex-col gap-3">
              {renderData(value, key)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostDetailItem;
