import React from "react";
import PostDetailsEditable from "post/post-shared/post-editable";
import { IContribute } from "post/post-db";
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
    <>
      {Object.entries(subValue).map(([completeKey, detailValue]) => (
        <ul key={`${completeKey}`} className="pl-1 grid grid-cols-[1rem,1fr]">
          <SquareUI classProp="mt-2"/>
          <li className="flex flex-col gap-2 mb-2">
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
          </li>
        </ul>
      ))}
    </>
  );
};

export default SubContriValue;
