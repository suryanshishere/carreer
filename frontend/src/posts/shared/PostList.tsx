import React from "react";
import RenderField from "posts/shared/render-post-data/RenderField";
import _ from "lodash"; 
import Tag from "./Tag";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import PostLinkItem from "./PostLinkItem";
import { ICommonListData } from "posts/db/interfaces";
import { ISectionKey } from "posts/db";
import { excludedKeys, RENAMING_DATA } from "posts/db/renders";

interface ListProps {
  data: ICommonListData[];
  section: ISectionKey;
}

const PostList: React.FC<ListProps> = ({ data, section }) => {
  const userTags = useSelector(
    (state: RootState) => state.user.mode.tags || {}
  );

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
            <span key={key} className="ml-1">
              <span>
                {(RENAMING_DATA?.[key] as string) || _.startCase(key)}:
              </span>
              {dateCheck ? (
                <span>
                  <RenderField
                    valueProp={`${
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
          <span key={key} className="ml-1">
            <span>{_.startCase(key)}:</span>
            <span className="ml-1">
              <RenderField valueProp={value} uniqueKey={key} noLinkClassProp />
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
