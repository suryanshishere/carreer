import React from "react";
import { Link } from "react-router-dom";
import Bookmark from "post/post_shared/Bookmark";
import RenderField from "post/post_shared/render_post_data/render_field";
import _ from "lodash";
import { excludedPostListKeys } from "post/post_shared/post-list-render-define";
import { IPostList, IPostListData } from "models/postModels/IPost";
import { ParaSkeletonLoad } from "shared/ui/SkeletonLoad";
import Tag, { shouldDisplayTag } from "./tag";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";

interface ListProps {
  data: IPostList;
  section: string;
  isSaved?: boolean;
}

const PostList: React.FC<ListProps> = ({ data, section, isSaved = false }) => {

 const userTags = useSelector(
     (state: RootState) => state.user.userData.mode.tags || {}
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
    <ul className="self-start w-full p-0 m-0 flex flex-col text-base">
      {data.map((item) => {
        // Use the helper to check if the tag should be displayed for this item.
        const displayTag =
          item.important_dates &&
          shouldDisplayTag(item.important_dates, section, userTags);
  
        if (!displayTag) {
          return null; // Skip rendering this item if the tag should not be displayed
        }
  
        return (
          <li key={item._id} className="flex my-2">
            <Tag section={section} importantDates={item.important_dates} />
            <div className="group w-full flex flex-col gap-1 justify-center">
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
                  classProp={`block ${
                    !item.is_saved ? "lg:hidden group-hover:block" : ""
                  }`}
                />
              </div>
              <p className="text-sm text-custom_gray flex flex-col flex-wrap gap-[2px]">
                {renderObject(item)}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
  
};

export default PostList;
