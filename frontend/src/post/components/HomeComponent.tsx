import React from "react";
import { Link } from "react-router-dom";
import { snakeCase, startCase } from "lodash";
import Bookmark from "post/post_shared/Bookmark";
import { IPostList } from "models/postModels/IPost";
import Tag from "post/post_shared/tag";

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
  const skeletonItemCount = getSkeletonItemCount(height);

  return (
    <div className="w-full text-base flex flex-col gap-1" style={{ height }}>
      <div className=" flex flex-col justify-center items-center gap-2">
        <h2 className="w-full text-center">{startCase(section)}</h2>
      </div>
      <hr />
      <div className="flex flex-col justify-between h-full">
        {ListItemData.length === 0 ? (
          <ul className="flex flex-col gap-3">
            {Array.from({ length: skeletonItemCount }).map((_, index) => (
              <li
                key={index}
                className="group flex flex-col justify-between gap-1 min-h-5 animate-pulse"
              >
                <div className="w-full h-7 bg-custom_less_gray rounded-sm"></div>
                <div
                  style={{ width: `${Math.random() * 50 + 50}%` }}
                  className="w-5/6 h-7 bg-custom_less_gray rounded-sm"
                ></div>
              </li>
            ))}
          </ul>
        ) : (
          <React.Fragment>
            <ul className="flex flex-col">
              {ListItemData?.slice(0, HOME_LIMIT).map((item, index) => (
                <React.Fragment key={item._id}>
                  <li className="group inline-flex justify-start items-center min-h-7 my-2">
                    <Tag
                      section={section}
                      importantDates={item.important_dates}
                    />
                    <Link
                      to={`/sections/${section}/${
                        item.post
                          ? item.post.post_code
                          : snakeCase(item.name_of_the_post) //TODO: remove name of the post completely
                      }?is_saved=${item.is_saved}`}
                      state={{ postId: item._id }}
                      className="custom-link"
                    >
                      {item.name_of_the_post}
                    </Link>
                    <Bookmark
                      section={section}
                      postId={item._id}
                      isSaved={item.is_saved}
                      classProp={`block ${
                        !item.is_saved ? "lg:hidden group-hover:block" : ""
                      }`}
                    />
                  </li> 
                </React.Fragment>
              ))}
            </ul>
            <Link
              className="text-custom_blue text-sm font-semibold pr-2 h-auto text-right self-end"
              to={`/sections/${section}`}
            >
              Read More
            </Link>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default HomeComponent;
