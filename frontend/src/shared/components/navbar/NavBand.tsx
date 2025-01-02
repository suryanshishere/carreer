import React from "react";

const NavBand = () => {
  return (
    <div className="w-full h-6 bg-custom-red text-custom-white overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {/* <span className="mr-4">🟢 LIVE</span> */}
        <span className="mr-4">Another headline or content item here! </span>
        <span className="mr-4">Keep adding content... </span>
      </div>
    </div>
  );
};

export default NavBand;
