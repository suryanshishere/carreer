import React from "react";
import _ from "lodash";
import RenderPostData from "posts/shared/render-post-data";
import { RENAMING_DATA } from "posts/db/renders";

type ItemComponentProps = {
  k: string;
  v: any;
};

const Item: React.FC<ItemComponentProps> = ({ k, v }) => {
  // Use only the part after the dot if present
  const displayKey = k.includes(".") ? k.split(".")[1] : k;
  const renderKey = ["date_ref", "link_ref", "fee_ref", "common_ref"].includes(
    k
  )
    ? k
    : null;

  return (
    <div className="w-full flex flex-col gap-1">
      <h2 className="whitespace-nowrap text-custom_red">
        {renderKey
          ? (RENAMING_DATA?.[renderKey] as string)
          : _.startCase(displayKey)}
      </h2>
      <div className="flex flex-col">
        <RenderPostData keyProp={k} valueProp={v} />
      </div>
    </div>
  );
};

export default Item;
