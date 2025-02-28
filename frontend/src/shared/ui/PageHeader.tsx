import { startCase } from "lodash";
import React from "react";
import DoubleDivider from "./DoubleDivider";

interface PageHeaderProps {
  subHeader: string;
  header: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ subHeader, header }) => {
  return (
    <div className="w-full flex flex-col mb-4">
      <h1>{startCase(header)}</h1>
      <DoubleDivider>
        <h3 className="text-custom_gray">{subHeader}</h3>
      </DoubleDivider>
    </div>
  );
};

export default PageHeader;
