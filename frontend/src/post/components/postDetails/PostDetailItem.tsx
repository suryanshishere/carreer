import React from "react";
import { startCase } from "lodash";
import { excludedKeys } from "./postDetailsUtils/post-detail-render-define";
import { IPostDetail } from "models/postModels/IPost";
import renderData from "./postDetailsUtils/render-data";
import { ParaSkeletonLoad, TableSkeletonLoad } from "shared/ui/SkeletonLoad";

interface DetailItemProps {
  data: IPostDetail;
}

const PostDetailItem: React.FC<DetailItemProps> = ({ data }) => {
  const isEmpty = Object.keys(data).length === 0;

  // Skeleton Rendering
  if (isEmpty) {
    return (
      <div className="w-full flex flex-col gap-3 animate-pulse">
        {[...Array(3)].map((_, index) => (
          <ParaSkeletonLoad key={index} />
        ))}

        <TableSkeletonLoad />

        {[...Array(3)].map((_, index) => (
          <ParaSkeletonLoad key={index} />
        ))}
      </div>
    );
  }

  // Normal Rendering
  return (
    <div className="w-full flex flex-col gap-4">
      {Object.entries(data).map(([key, value], index) => {
        if (excludedKeys.includes(key)) {
          return null;
        }
        const displayKey = key.includes(".") ? key.split(".")[1] : key;
        return (
          <div key={index} className="w-full flex flex-col gap-1">
            <h2 className="whitespace-nowrap text-custom-red">
              {startCase(displayKey)}
            </h2>
            <div className="flex flex-col">{renderData(value, key)}</div>
          </div>
        );
      })}
    </div>
  );
};

export default PostDetailItem;
