import React from "react";
import { startCase } from "lodash";
import { excludedKeys, renamingKeys } from "posts/db/renders";
import renderPostData from "../../shared/render-post-data";
import { ParaSkeletonLoad, TableSkeletonLoad } from "posts/shared/SkeletonLoad";

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

  return (
    <div className="w-full flex flex-col gap-4">
      {Object.entries(data).map(([key, value]: [string, any], index) => {
        //filtering the logic at the top level
        if (
          excludedKeys.includes(key) ||
          value === null ||
          value === undefined ||
          (typeof value === "object" && Object.keys(value).length === 0) ||
          (typeof value === "object" &&
            Object.keys(value).length === 1 &&
            "_id" in value) ||
          (typeof value === "object" &&
            Object.keys(value).length === 4 &&
            "_id" in value &&
            "createdAt" in value &&
            "updatedAt" in value &&
            "__v" in value)
        ) {
          return null;
        }

        const displayKey = key.includes(".") ? key.split(".")[1] : key;

        return (
          <div key={index} className="w-full flex flex-col gap-1">
            <h2 className="whitespace-nowrap text-custom_red">
              {renamingKeys[key] ?? startCase(displayKey)}
            </h2>
            <div className="flex flex-col">{renderPostData(key, value)}</div>
          </div>
        );
      })}
    </div>
  );
};

export default PostDetailComponent;
