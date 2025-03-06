import React from "react";
import { startCase } from "lodash";
import { excludedKeys } from "post/post-db"; 
import renderPostData from "../../post-shared/render-post-data";
import { ParaSkeletonLoad, TableSkeletonLoad } from "post/post-shared/SkeletonLoad";

const PostDetailComponent: React.FC<{
  data: any;
}> = ({ data }) => {
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
            <h2 className="whitespace-nowrap text-custom_red">
              {startCase(displayKey)}
            </h2>
            <div className="flex flex-col">{renderPostData(key, value)}</div>
          </div>
        );
      })}
    </div>
  );
};

export default PostDetailComponent;
