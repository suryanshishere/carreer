import React from "react";

export const ParaSkeletonLoad = () => {
  return (
    <li className="py-2 flex flex-col gap-2 animate-pulse">
      <div
        style={{ width: `${Math.random() * 25 + 75}%` }}
        className="h-7 w-1/2 bg-custom-less-gray rounded-sm"
      ></div>
      <div className="flex flex-col gap-1">
        <div className="h-4 w-full bg-custom-less-gray rounded-sm"></div>
        <div
          style={{ width: `${Math.random() * 25 + 76}%` }}
          className="h-4 w-2/3 bg-custom-less-gray rounded-sm"
        ></div>
      </div>
    </li>
  );
};

export const TableSkeletonLoad = () => {
  return (
    <div className="w-full flex flex-col">
      <div
        style={{ width: `${Math.random() * 25 + 75}%` }}
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
  );
};
