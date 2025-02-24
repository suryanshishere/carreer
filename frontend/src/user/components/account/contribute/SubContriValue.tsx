import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "shared/store";
import { resetKeyValuePairs, setEditContribute } from "shared/store/post-slice";
import PostDetailsEditable from "post/components/postDetails/postDetailsUtils/PostDetailsEditable";

interface SubContriValueProps {
  subValue: Record<string, any> | string | number | null;
  isEditing: boolean;
}

const SubContriValue: React.FC<SubContriValueProps> = ({
  subValue,
  isEditing,
}) => { 

  return (
    <>
      {typeof subValue === "object" && !Array.isArray(subValue) ? (
        Object.entries(
          subValue as {
            [key: string]: string | number | Date;
          }
        ).map(([detailKey, detailValue]) => (
          <React.Fragment key={`${detailKey}`}>
            <ul className="pl-1 grid grid-cols-[1rem,1fr]">
              <div className="w-2 h-2 mt-2 bg-custom-gray rounded-sm"></div>
              <li className="flex flex-col mb-2">
                <span className="text-sm font-semibold text-custom-gray">
                  {detailKey.replace(/\./g, " / ")}:
                </span>
                {isEditing ? (
                  <PostDetailsEditable
                    keyProp={detailKey}
                    value={detailValue}
                  />
                ) : (
                  <span>{detailValue.toString()}</span>
                )}
              </li>
            </ul>
          </React.Fragment>
        ))
      ) : (
        <p>{subValue ? subValue.toString() : ""}</p>
      )}
    </>
  );
};

export default SubContriValue;
