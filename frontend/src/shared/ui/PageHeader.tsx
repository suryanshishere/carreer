import { startCase } from "lodash";
import React from "react";
import Divider from "./DoubleDivider";

interface PageHeaderProps {
  subHeader: React.ReactNode;
  header: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ subHeader, header }) => {
  return (
    <div className="w-full flex flex-col mb-4">
      <h1>{startCase(header)}</h1>
      <Divider >
        <h3 className="text-custom-gray">{subHeader}</h3>
      </Divider>
    </div>
  );
};

export default PageHeader;
