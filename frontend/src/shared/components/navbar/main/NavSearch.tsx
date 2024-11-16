import React from "react";
import { Input } from "shared/utils/form/input/Input";

const NavSearch = () => {
  return (
    <div className="items-center mr-1 ml-1">
      <Input
        name="search"
        placeholder=""
        type="search"
      />
    </div>
  );
};

export default NavSearch;
