import { startCase } from "lodash";
import React from "react";

interface PageHeaderProps {
  subHeader: React.ReactNode;
  header: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ subHeader, header }) => {
  return (
    <div className="w-full flex flex-col">
      <h1 className="self-start pl-0 font-bold text-2xl">
        {startCase(header)}
      </h1>
      <h3 className="text-base text-custom-gray flex items-end gap-1">
        {subHeader}
        <div className="flex-1 ml-1 flex flex-col gap-1 mb-[6px]">
          <hr className="flex-1" />
          <hr className="flex-1" />
        </div>
      </h3>
    </div>
  );
};

export default PageHeader;
