import React from "react";
import _ from "lodash";
import {
  excludedKeys,
  QUICK_ACCESS_RENDER,
  renamingData,
} from "posts/db/renders";
import renderPostData from "posts/shared/render-post-data";
import { ParaSkeletonLoad, TableSkeletonLoad } from "posts/shared/SkeletonLoad";
import { useParams } from "react-router-dom";
import { ISectionKey } from "posts/db";

const PostDetailItem: React.FC<{ data: any }> = ({ data }) => {
  const isEmpty = Object.keys(data).length === 0;
  const section = useParams<{ section: ISectionKey }>().section;

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

  // Filter out the excluded items
  const filteredEntries = Object.entries(data).filter(([key, value]) => {
    return !(
      excludedKeys[key] ||
      value === null ||
      value === "" ||
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
    );
  });

  // Determine the range indices from the filtered list
  const range = section ? QUICK_ACCESS_RENDER[section] : null;
  const startIdx = range ? range[0] : -1;
  const endIdx = range ? range[1] : -1;

  // Prepare the "after" group items
  const afterItems = filteredEntries.slice(endIdx + 1);
  // If there are more than 2 items, separate the last 2 items
  const otherAfterItems =
    afterItems.length > 2 ? afterItems.slice(0, afterItems.length - 2) : [];
  const lastTwoAfterItems =
    afterItems.length >= 2 ? afterItems.slice(-2) : afterItems;

  return (
    <div className="w-full flex flex-col gap-[1.75rem]">
      {/* Render items before the defined range */}
      {filteredEntries.slice(0, startIdx).map(([key, value], index) => (
        <ItemComponent key={index} k={key} v={value} />
      ))}

      {/* Render items inside the range (wrapped in a single box) */}
      {range && (
        <div className="mt-4 relative w-full">
          <h3 className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-custom_white px-2 text-custom_red font-bold">
            Quick Information
          </h3>
          <div className="border-3 border-dashed border-custom_gray p-3 w-full flex flex-col gap-[1rem]">
            {filteredEntries
              .slice(startIdx, endIdx + 1)
              .map(([key, value], index) => (
                <ItemComponent key={index} k={key} v={value} />
              ))}
          </div>
        </div>
      )}

      {/* Render remaining items after the range */}
      {otherAfterItems.map(([key, value], index) => (
        <ItemComponent key={index} k={key} v={value} />
      ))}

      {lastTwoAfterItems.length === 2 ? (
        // If there are exactly 2 items, group them with a header "Direct Access"
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-center">
            <div className="border-t-2 flex-grow border-dashed border-custom_gray"></div>
            <h3 className="whitespace-nowrap px-2 text-custom_red font-bold bg-custom_white">
              Direct Link and Date Information
            </h3>
            <div className="border-t-2 flex-grow border-dashed border-custom_gray"></div>
          </div>
          {lastTwoAfterItems.map(([key, value], index) => (
            <ItemComponent key={index} k={key} v={value} />
          ))}
        </div>
      ) : (
        // If not, simply render them normally.
        lastTwoAfterItems.map(([key, value], index) => (
          <ItemComponent key={index} k={key} v={value} />
        ))
      )}
    </div>
  );
};

const ItemComponent: React.FC<{ k: string; v: any }> = ({ k, v }) => {
  const displayKey = k.includes(".") ? k.split(".")[1] : k;
  const renderKey = ["date_ref", "link_ref", "fee_ref", "common_ref"].includes(
    k
  )
    ? k
    : null;

  return (
    <div className="w-full flex flex-col gap-1">
      <h2 className="whitespace-nowrap text-custom_red">
        {renderKey
          ? (renamingData?.[renderKey] as string)
          : _.startCase(displayKey)}
      </h2>
      <div className="flex flex-col">{renderPostData(k, v)}</div>
    </div>
  );
};

export default PostDetailItem;
