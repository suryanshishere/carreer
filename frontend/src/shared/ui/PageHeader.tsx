import React, { ReactNode } from "react";
import DoubleDivider from "./DoubleDivider";

const PageHeader: React.FC<{ header: ReactNode; subHeader?: ReactNode }> = ({
  subHeader,
  header,
}) => {
  return (
    <div className="w-full flex flex-col">
      <h1>{header}</h1>
      <DoubleDivider>
        {subHeader && <h3 className="text-custom_gray">{subHeader}</h3>}
      </DoubleDivider>
    </div>
  );
};

export default PageHeader;
