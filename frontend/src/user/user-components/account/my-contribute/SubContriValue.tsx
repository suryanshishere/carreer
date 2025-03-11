import React from "react";
import PostDetailsEditable from "post/shared/post-editable";
import { IContribute } from "post/db/interfaces";
import { SquareUI } from "shared/ui";

interface SubContriValueProps {
  subValue: IContribute;
  isEditing: boolean;
}

const SubContriValue: React.FC<SubContriValueProps> = ({
  subValue,
  isEditing,
}) => {
  console.log("subValue of the SubContriValue component", subValue);
  return (
    <ul className="custom_ul">
      {Object.entries(subValue).map(([completeKey, detailValue]) => (
        <li>
          <div className="w-full flex flex-col gap-2 mb-2">
            <span className="text-sm font-semibold text-custom_gray">
              {completeKey.replace(/\./g, " / ")}:
            </span>
            {isEditing ? (
              <PostDetailsEditable
                keyProp={completeKey}
                valueProp={detailValue}
              />
            ) : (
              <span>{detailValue.toString()}</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default SubContriValue;
