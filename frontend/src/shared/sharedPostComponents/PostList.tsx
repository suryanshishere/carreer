import React from "react";
import { Link } from "react-router-dom";
import { IPostList, IPostListData } from "models/postModels/IPostList";
import Bookmark from "shared/sharedPostComponents/Bookmark";
import { renderDateStrNum } from "../quick/render-date-str-num";
// import flattenToLastKeys from "shared/quick/flatten-object";
import { snakeCase, startCase } from "lodash";
// import { excludedKeys } from "post/post-detail-render-define";
import { excludedPostListKeys } from "post/post-list-render-define";
import Tag from "./Tag";

interface ListProps {
  data: IPostList;
  section: string;
  isSaved?: boolean;
}

const PostList: React.FC<ListProps> = ({ data, section, isSaved = false }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const renderObject = (obj: IPostListData) => {
    return Object.entries(obj)
      .filter(([key]) => !excludedPostListKeys.includes(key))
      .map(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          const nestedEntries = Object.entries(value);
          if (
            nestedEntries.every(
              ([_, nestedValue]) =>
                typeof nestedValue !== "object" || nestedValue === null
            )
          ) {
            return (
              <span key={key}>
                <span className="pl-2">{startCase(key)}:</span>
                <span className="pl-2">
                  {(value?.current_year || value?.previous_year) != null ? (
                    <span>
                      {renderDateStrNum(
                        `${value.current_year || `${value.previous_year}`}`,
                        key
                      )}
                    </span>
                  ) : (
                    <span key={key}>{renderObject(value)}</span>
                  )}
                </span>
              </span>
            );
          } else {
            return <span key={key}>{renderObject(value)}</span>;
          }
        } else {
          return (
            <span key={key} className="mr-2">
              <span>{startCase(key)}:</span>
              <span className="ml-1">{renderDateStrNum(value, key)}</span>
            </span>
          );
        }
      });
  };

  return (
    <ul className="self-start p-0 m-0 flex flex-col gap-2 text-base">
      {data.map((item, index) => (
        <React.Fragment key={item._id}>
          <li className="w-fit ">
            <div className="flex gap-2 items-center">
              <Link
                to={`/sections/${section}/${snakeCase(
                  item.name_of_the_post
                )}?is_saved=${item.is_saved}`}
                state={{ postId: item._id }}
                className="text-custom-red font-semibold underline decoration-1 underline-offset-2 visited:text-custom-gray  hover:decoration-custom-gray "
              >
                {item.name_of_the_post}
              </Link>
              <div className="self-end flex gap-1 items-center">
                {item.important_dates && Tag(item.important_dates, section)}
                <Bookmark
                  section={section}
                  postId={item._id}
                  isSaved={item.is_saved || isSaved}
                />
              </div>
            </div>
            <span className="text-sm mr-2">
              <span>{renderObject(item)}</span>
            </span>
          </li>
          {index !== data.length - 1 && <hr />}
        </React.Fragment>
      ))}
    </ul>
  );
};

export default PostList;
