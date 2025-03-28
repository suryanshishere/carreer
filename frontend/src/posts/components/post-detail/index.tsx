import React from "react";
import { excludedKeys, QUICK_ACCESS_RENDER } from "posts/db/renders";
import { useParams } from "react-router-dom";
import { ISectionKey } from "posts/db";
import Item from "./item";

const PostDetailItem: React.FC<{ data: any }> = ({ data }) => {
  const { section } = useParams<{ section: ISectionKey }>();

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

  // Get the range object for the current section
  const rangeKeys = section ? QUICK_ACCESS_RENDER[section] : null;

  // If rangeKeys exist, calculate quick info indices; otherwise, we won't split
  let startIdx = -1,
    endIdx = -1;
  let shouldRenderQuickInfo = false;

  if (rangeKeys) {
    filteredEntries.forEach(([key], index) => {
      if (rangeKeys[key]) {
        if (startIdx === -1) startIdx = index; // First occurrence
        endIdx = index; // Last occurrence
      }
    });
    shouldRenderQuickInfo = startIdx !== -1 && endIdx !== -1;
  }

  // When Quick Information exists, we split the array into three parts.
  // Also, we separate the last two items from the after group.
  let beforeItems: [string, any][] = [];
  let quickInfoItems: [string, any][] = [];
  let otherAfterItems: [string, any][] = [];
  let lastTwoAfterItems: [string, any][] = [];

  if (shouldRenderQuickInfo) {
    beforeItems = filteredEntries.slice(0, startIdx);
    quickInfoItems = filteredEntries.slice(startIdx, endIdx + 1);
    const afterItems = filteredEntries.slice(endIdx + 1);
    lastTwoAfterItems =
      afterItems.length >= 2 ? afterItems.slice(-2) : afterItems;
    otherAfterItems =
      afterItems.length > 2 ? afterItems.slice(0, -2) : [];
  }

  return (
    <div className="w-full flex flex-col gap-[1.75rem]">
      {shouldRenderQuickInfo ? (
        <>
          {/* Render items before Quick Information */}
          {beforeItems.map(([key, value], index) => (
            <Item key={index} k={key} v={value} />
          ))}

          {/* Quick Information Section */}
          <div className="mt-4 relative w-full">
            <h3 className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-custom_white px-2 text-custom_red font-bold">
              Quick Information
            </h3>
            <div className="border-3 border-dashed border-custom_gray p-3 w-full flex flex-col gap-[1rem]">
              {quickInfoItems.map(([key, value], index) => (
                <Item key={index} k={key} v={value} />
              ))}
            </div>
          </div>

          {/* Render remaining items (excluding the last two items) */}
          {otherAfterItems.map(([key, value], index) => (
            <Item key={index} k={key} v={value} />
          ))}

          {/* Direct Links and Dates Information Section */}
          {lastTwoAfterItems.length === 2 && (
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex items-center">
                <div className="border-t-2 flex-grow border-dashed border-custom_gray"></div>
                <h3 className="whitespace-nowrap px-2 text-custom_red font-bold bg-custom_white">
                  Direct Links and Dates Information
                </h3>
                <div className="border-t-2 flex-grow border-dashed border-custom_gray"></div>
              </div>
              {lastTwoAfterItems.map(([key, value], index) => (
                <Item key={index} k={key} v={value} />
              ))}
            </div>
          )}
        </>
      ) : (
        // When there is no Quick Information, render the entire list once.
        filteredEntries.map(([key, value], index) => (
          <Item key={index} k={key} v={value} />
        ))
      )}
    </div>
  );
};

export default PostDetailItem;
