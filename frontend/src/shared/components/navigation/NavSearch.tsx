import React from "react";
import { Input } from "shared/utilComponents/form/input/Input";

const NavSearch = () => {
  return (
    <div className="flex-1 items-center bg-custom-white mr-1 ml-1">
      <Input
        name="search"
        placeholder=""
        style={{ height: ".1rem", fontSize: "1rem" }}
        type="search"
      />
    </div>
  );
};

export default NavSearch;
