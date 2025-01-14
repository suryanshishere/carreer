import React from "react";

const Mode = () => {
  const [isChecked, setIsChecked] = React.useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="">
      <label className="relative w-14 flex cursor-pointer select-none items-center">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="sr-only"
        />
        <div
          className={`h-6 w-full rounded-full transition bg-custom-less-gray text-xs font-bold flex items-center justify-center text-custom-black whitespace-nowrap ${
            isChecked ? "bg-custom-less-blue" : ""
          }`}
        >
          {!isChecked && <span className="ml-5 pr-1">MAX</span>}
        </div>
        <div
          className={`dot absolute top-[4px] mx-1 h-4 w-4 rounded-full transition-transform ${
            isChecked
              ? "translate-x-8 bg-custom-white "
              : "translate-x-0 bg-custom-gray "
          }`}
        ></div>
      </label>
    </div>
  );
};

export default Mode;
