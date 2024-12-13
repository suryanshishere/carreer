import React from "react";
import { Link } from "react-router-dom";
import { IPostList, IPostListData } from "models/postModels/IPostList";
import Bookmark from "shared/components/Bookmark";
import { renderDateStrNum } from "../quick/render-date-str-num";
import flattenToLastKeys from "shared/quick/flatten-object";
import { startCase } from "lodash";
import { excludedKeys } from "post/post-detail-render-define";
import { excludedPostListKeys } from "post/post-list-render-define";

interface ListProps {
  data: IPostList;
  section: string;
  isSaved?: boolean;
}

const CATEGORY_LIMIT =
  Number(process.env.REACT_APP_NUMBER_OF_POST_CATEGORYLIST) || 25;

const PostList: React.FC<ListProps> = ({ data, section, isSaved = false }) => {
  if (data.length === 0) return null;

  // console.log(data)
  const renderObject = (obj: IPostListData) => {
    return Object.entries(obj)
      .filter(([key]) => !excludedPostListKeys.includes(key))
      .map(([key, value]) => {
        // Check if the value is an object and not the last-level object
        if (typeof value === "object" && value !== null) {
          // If value is a nested object, check its entries
          const nestedEntries = Object.entries(value);

          // If the nested object is the last level (doesn't contain any other nested objects)
          if (
            nestedEntries.every(
              ([_, nestedValue]) =>
                typeof nestedValue !== "object" || nestedValue === null
            )
          ) {
            return (
              <span key={key} className="pl-2">
                <span className="text-custom-less-gray text-sm">
                  {startCase(key)}:
                </span>
                <span className="pl-2">
                  {value?.current_year != null &&
                  value.previous_year != null ? (
                    <span>
                      {renderDateStrNum(
                        value.current_year || value.previous_year,
                        key
                      )}
                    </span>
                  ) : (
                    <span key={key}>{renderObject(value)}</span>
                  )}
                </span>
                {/* <span> </span> */}
              </span>
            );
          } else {
            return <span key={key}>{renderObject(value)}</span>;
          }
        } else {
          return (
            <span key={key} className="text-custom-less-gray text-sm mr-2">
              <span className=" ">
                <span>{startCase(key)}:</span>
                <span className="text-custom-black ml-1">
                  {renderDateStrNum(value)}
                </span>
              </span>
              {/* <span> </span> */}
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
                to={`/sections/${section}/${item._id}?is_saved=${item.is_saved}`}
                className="text-custom-red underline decoration-1 underline-offset-2 hover:text-custom-blue"
              >
                {item.name_of_the_post}
              </Link>
              <div className="self-end">
                <Bookmark
                  section={section}
                  postId={item._id}
                  isSaved={item.is_saved || isSaved}
                />
              </div>
            </div>
            <span className="text-custom-less-gray text-sm mr-2">
              <span className="bg-custom-pale-yellow px-1 whitespace-nowrap">
                <span>Updated At:</span>
                <span className="text-custom-black ml-1">
                  {renderDateStrNum(item.updatedAt)}
                </span>
              </span>
              <span className="pl-2">{renderObject(item)}</span>
            </span>
          </li>
          {index !== data.length - 1 && (
            <hr className="w-full border-t-1 border-custom-less-gray" />
          )}
        </React.Fragment>
      ))}
    </ul>
  );
};

export default PostList;
