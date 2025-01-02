import React from "react";
import { Link } from "react-router-dom";
import Bookmark from "post/shared/Bookmark";
import RenderPostDetail from "../components/RenderPostDetail";
import _, { lowerCase, snakeCase, startCase } from "lodash";
import { excludedPostListKeys } from "post/shared/post-list-render-define";
import Tag from "./Tag";
import { IPostList, IPostListData } from "models/postModels/IPost";
import RenderField from "shared/ui/RenderField";

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
        const dateCheck = (value?.current_year || value?.previous_year) != null;

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
                <span
                  className={`mr-1 ${!dateCheck && "text-custom-less-gray"}`}
                >
                  {startCase(key)}:
                </span>
                <span className="mr-1">
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
                    <span key={key}>{renderObject(value)}</span>
                  )}
                </span>
              </span>
            );
          } else {
            return (
              <span key={key} className="mr-2">
                {renderObject(value)}
              </span>
            );
          }
        } else {
          return (
            <span key={key} className="mr-1">
              <span className={`mr-1`}>{startCase(key)}:</span>
              <span className="mr-1">
                <RenderField stringValue={_.toString(value)} uniqueKey={key} />
              </span>
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
                to={`/sections/${section}/${
                  item.post
                    ? item.post.post_code
                    : snakeCase(item.name_of_the_post) //TODO: remove name of the post completly
                }?is_saved=${item.is_saved}`}
                state={{ postId: item._id }}
                className="custom-link"
              >
                {item.name_of_the_post}
              </Link>
              <div className="self-end flex gap-1 items-center">
                {item.important_dates && (
                  <Tag
                    importantDates={item.important_dates}
                    section={section}
                  />
                )}
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
