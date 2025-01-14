import React from "react";
import { Link } from "react-router-dom";
import Bookmark from "post/shared/Bookmark";
import RenderField from "shared/ui/RenderField";
import _ from "lodash";
import { excludedPostListKeys } from "post/shared/post-list-render-define";
import { IPostList, IPostListData } from "models/postModels/IPost";
import tag from "./tag";

interface ListProps {
  data: IPostList;
  section: string;
  isSaved?: boolean;
}

const PostList: React.FC<ListProps> = ({ data, section, isSaved = false }) => {
  if (data.length === 0) {
    return (
      <ul className="self-start w-full p-0 m-0 flex flex-col gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <li key={index} className="py-2 flex flex-col gap-2 animate-pulse">
            <div
              style={{ width: `${Math.random() * 50 + 50}%` }}
              className="h-7 w-1/2 bg-custom-less-gray rounded-sm"
            ></div>
            <div className="flex flex-col gap-1">
              <div className="h-4 w-full bg-custom-less-gray rounded-sm"></div>
              <div
                style={{ width: `${Math.random() * 50 + 51}%` }}
                className="h-4 w-2/3 bg-custom-less-gray rounded-sm"
              ></div>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  const renderObject = (obj: IPostListData) => {
    return Object.entries(obj)
      .filter(([key]) => !excludedPostListKeys.includes(key))
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
              <RenderField stringValue={_.toString(value)} uniqueKey={key} />
            </span>
          </span>
        );
      });
  };

  return (
    <ul className="self-start w-full p-0 m-0 flex flex-col text-base">
      {data.map((item, index) => (
        <React.Fragment key={item._id}>
          <li
            className={`group py-2 flex flex-col gap-1 justify-center ${tag(
              section,
              item.important_dates
            )}`}
          >
            <div className="flex justify-between items-center gap-1 min-h-7">
              <Link
                to={`/sections/${section}/${
                  item.post
                    ? item.post.post_code
                    : _.snakeCase(item.name_of_the_post)
                }?is_saved=${item.is_saved}`}
                state={{ postId: item._id }}
                className="custom-link"
              >
                {item.name_of_the_post}
              </Link>
              <Bookmark
                section={section}
                postId={item._id}
                isSaved={item.is_saved || isSaved}
                classProp={`${!item.is_saved && "hidden"} group-hover:block`}
              />
            </div>
            <p className="text-sm text-custom-gray flex flex-col flex-wrap gap-[2px]">
              {renderObject(item)}
            </p>
          </li>
          {index !== data.length - 1 && <hr />}
        </React.Fragment>
      ))}
    </ul>
  );
};

export default PostList;
