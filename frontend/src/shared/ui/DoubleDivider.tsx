import React from "react";

const DoubleDivider: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="flex items-center gap-2">
      {children}
      <div className="flex flex-col flex-grow">
        <hr className="mt-2" />
        <hr className="mt-1" />
      </div>
    </div>
  );
};

export default DoubleDivider;
