import React from "react";

const Divider: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="flex items-center gap-2">
      {children}
      <hr className="mt-2"/>
    </div>
  );
};

export default Divider;
