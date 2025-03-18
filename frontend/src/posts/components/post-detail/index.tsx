import React from "react";
import _ from "lodash";
import { excludedKeys, renamingData } from "posts/db/renders";
import renderPostData from "posts/shared/render-post-data";
import { ParaSkeletonLoad, TableSkeletonLoad } from "posts/shared/SkeletonLoad";

const PostDetailItem: React.FC<{
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

  return (
    <div className="w-full flex flex-col gap-[1.75rem]">
      {Object.entries(data).map(([key, value]: [string, any], index) => {
        if (excludedKeys[key] || !value) return null;
        const displayKey = key.includes(".") ? key.split(".")[1] : key;

        return (
          <div key={index} className="w-full flex flex-col gap-1">
            <h2 className="whitespace-nowrap text-custom_red">
              {(renamingData?.[key] as string) || _.startCase(displayKey)}
            </h2>
            <div className="flex flex-col">{renderPostData(key, value)}</div>
          </div>
        );
      })}
    </div>
  );
};

export default PostDetailItem;
