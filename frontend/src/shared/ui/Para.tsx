import React, { ReactNode } from "react";

const Para: React.FC<{ header?: ReactNode; subHeader?: ReactNode }> = ({
  header,
  subHeader,
}) => {
  return (
    <p className="min-h-40 w-full flex flex-col items-center justify-center text-center">
      <span className="text-xl font-semibold">{header} </span>
      <span>({subHeader})</span>
    </p>
  );
};

export default Para;
