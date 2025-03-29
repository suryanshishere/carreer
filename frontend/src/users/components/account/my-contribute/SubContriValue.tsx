import React from "react";
import PostDetailsEditable from "posts/shared/post-editable";
import { IContribute } from "posts/db/interfaces";
import { startCase } from "lodash";
import { getDisplayKey } from "posts/utils";

interface SubContriValueProps {
  subValue: IContribute;
  isEditing: boolean;
}

const SubContriValue: React.FC<SubContriValueProps> = ({
  subValue,
  isEditing,
}) => {
  return (
    <ul className="custom_ul">
      {Object.entries(subValue).map(([completeKey, detailValue]) => (
        <li key={completeKey}>
          <div className="w-full flex flex-col gap-2 mb-2">
            <span className="font-bold text-custom_gray">
              {startCase(getDisplayKey(completeKey))}
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
