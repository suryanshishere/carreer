import React from "react";
import { Link } from "react-router-dom";
import { snakeCase, startCase } from "lodash";
import Bookmark from "post/post_shared/Bookmark";
import { IPostList } from "models/postModels/IPost";
import Tag, { shouldDisplayTag } from "post/post_shared/tag";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import { HomeSkeletonLoad } from "post/post_shared/skeleton_load";
import PostLinkItem from "post/post_shared/post_link_item";

interface HomeListItemProps {
  ListItemData: IPostList;
  section: string;
  height?: string;
}

const HOME_LIMIT = Number(process.env.REACT_APP_NUMBER_OF_POST_HOMELIST) || 12;

// Function to determine the number of skeleton items based on height
const getSkeletonItemCount = (height: string | undefined) => {
  if (height) {
    const numericHeight = parseInt(height, 10);
    if (numericHeight > 50) {
      return 10; // Provide more skeletons for larger height
    }
  }
  return 6; // Default skeletons for smaller height
};

const HomeComponent: React.FC<HomeListItemProps> = ({
  ListItemData,
  section,
  height,
}) => {
  const userTags = useSelector(
    (state: RootState) => state.user.mode.tags || {}
  );

  const skeletonItemCount = getSkeletonItemCount(height);

  return (
    <div className="w-full text-base flex flex-col gap-1" style={{ height }}>
      <div className="flex flex-col justify-center items-center gap-2">
        <h2 className="w-full text-center">{startCase(section)}</h2>
      </div>
      <hr />
      <div className="flex flex-col justify-between h-full">
        {ListItemData.length === 0 ? (
          <ul className="flex flex-col gap-3">
            {Array.from({ length: skeletonItemCount }).map((_, index) => (
              <HomeSkeletonLoad key={index} />
            ))}
          </ul>
        ) : (
          <>
            <ul className="flex flex-col">
              {ListItemData.slice(0, HOME_LIMIT).map((item) => {
                // Use the helper to check if the tag should be displayed for this item.
                const displayTag =
                  item.important_dates &&
                  shouldDisplayTag(item.important_dates, section, userTags);

                if (!displayTag) {
                  return null;
                }

                return (
                  <li
                    key={item._id}
                    className="group inline-flex justify-start items-center min-h-7 my-2"
                  >
                    <Tag
                      section={section}
                      importantDates={item.important_dates}
                    />

                    <PostLinkItem section={section} item={item} />
                  </li>
                );
              })}
            </ul>
            <Link
              className="text-custom_blue text-sm font-semibold pr-2 h-auto text-right self-end"
              to={`/sections/${section}`}
            >
              Read More
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default HomeComponent;
