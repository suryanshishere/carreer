import React from "react";
import { startCase } from "lodash";
import { excludedKeys } from "./postDetailsUtils/post-detail-render-define";
import { IPostDetail } from "models/postModels/IPost";
import renderData from "./postDetailsUtils/render-data";

interface DetailItemProps {
  data: IPostDetail;
}

const PostDetailItem: React.FC<DetailItemProps> = ({ data }) => {
  const isEmpty = Object.keys(data).length === 0;

  // Skeleton Rendering
  if (isEmpty) {
    return (
      <div className="w-full flex flex-col gap-8 animate-pulse">
        {/* Article Skeleton */}
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex flex-col gap-1 w-full text-base">
            <div className="flex items-end gap-2">
              <div
                style={{ width: `${Math.random() * 50 + 50}%` }}
                className="h-5 bg-custom-less-gray"
              ></div>
              <div className="flex-1 h-1 bg-custom-less-gray"></div>
            </div>
            <div className="py-1 flex flex-col gap-3">
              {[...Array(2)].map((_, idx) => (
                <div
                  key={idx}
                  style={{ width: `${Math.random() * 50 + 50}%` }}
                  className="h-4 bg-custom-less-gray"
                ></div>
              ))}
            </div>
          </div>
        ))}

        {/* Table Skeleton */}
        <div className="w-full flex flex-col gap-2">
          <div
            style={{ width: `${Math.random() * 50 + 50}%` }}
            className="h-5 bg-custom-less-gray mb-2"
          ></div>
          <div className="w-full border border-custom-less-gray overflow-hidden">
            {[...Array(4)].map((_, rowIndex) => (
              <div
                key={rowIndex}
                className={`flex ${
                  rowIndex === 0 ? "bg-custom-less-gray" : "bg-custom-white"
                } p-2`}
              >
                {[...Array(3)].map((_, colIndex) => (
                  <div key={colIndex} className="h-4 mx-1"></div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex flex-col gap-1 w-full text-base">
            <div className="flex items-end gap-2">
              <div
                style={{ width: `${Math.random() * 50 + 50}%` }}
                className="h-5 bg-custom-less-gray "
              ></div>
              <div className="flex-1 h-1 bg-custom-less-gray"></div>
            </div>
            <div className="py-1 flex flex-col gap-3">
              {[...Array(2)].map((_, idx) => (
                <div
                  key={idx}
                  style={{ width: `${Math.random() * 50 + 50}%` }}
                  className="h-4 bg-custom-less-gray"
                ></div>
              ))}
            </div>
          </div>
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
            <div className="flex items-end gap-2">
              <h2 className="flex-none text-custom-red">
                {startCase(displayKey)}
              </h2>
              <hr className="mb-3 flex-1" />
            </div>
            <div className="pl-1 flex flex-col">{renderData(value, key)}</div>
          </div>
        );
      })}
    </div>
  );
};

export default PostDetailItem;
