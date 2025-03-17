import React from "react";
import RenderField from "posts/shared/render-post-data/RenderField";
import _ from "lodash"; 
import { ParaSkeletonLoad } from "./SkeletonLoad";
import Tag from "./Tag";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import PostLinkItem from "./PostLinkItem";
import { ICommonListData } from "posts/db/interfaces";
import { ISectionKey } from "posts/db";
import { excludedKeys } from "posts/db/renders";

interface ListProps {
  data: ICommonListData[];
  section: ISectionKey;
}

const PostList: React.FC<ListProps> = ({ data, section }) => {
  const userTags = useSelector(
    (state: RootState) => state.user.mode.tags || {}
  );

  if (data.length === 0) {
    return (
      <ul className="self-start w-full p-0 m-0 flex flex-col gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <ParaSkeletonLoad key={index} />
        ))}
      </ul>
    );
  }

  const renderObject = (obj: ICommonListData) => {
    return Object.entries(obj)
      .filter(([key]) => !excludedKeys[key])
      .map(([key, value]: [string, any]) => {
        if (!value) return null;

        if (typeof value === "object") {
          if (Object.keys(value).length === 0) return null;

          const dateCheck =
            (value?.current_year || value?.previous_year) != null;

          return (
            <span key={key} className="mr-2">
              <span className="mr-2">{_.startCase(key)}:</span>
              {dateCheck ? (
                <span>
                  <RenderField
                    stringValue={`${
                      value.current_year || `${value.previous_year}`
                    }`}
                    uniqueKey={key}
                  />
                </span>
              ) : (
                renderObject(value)
              )}
            </span>
          );
        }

        return (
          <span key={key} className="mr-1">
            <span className={`mr-1`}>{_.startCase(key)}:</span>
            <span className="mr-1">
              <RenderField
                stringValue={_.toString(value)}
                uniqueKey={key}
                noLinkClassProp
              />
            </span>
          </span>
        );
      });
  };

  return (
    <ul className="w-full flex flex-col gap-[6px]">
      {data.map((item, index) => {
        if (!userTags["none"] && !userTags[item.tag]) {
          return null;
        }

        return (
          <React.Fragment key={item._id}>
            <li className="flex">
              <Tag tag={item.tag} />
              <div className="group w-full flex flex-col gap-1 justify-center">
                <PostLinkItem section={section} item={item} />
                <p className="text-sm text-custom_gray flex flex-col flex-wrap gap-[2px]">
                  {renderObject(item)}
                </p>
              </div>
            </li>
            {index !== data.length - 1 && <hr />}
          </React.Fragment>
        );
      })}
    </ul>
  );
};

export default PostList;
