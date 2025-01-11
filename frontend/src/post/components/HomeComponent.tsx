import React from "react";
import { Link } from "react-router-dom";
import { snakeCase, startCase } from "lodash";
import Bookmark from "post/shared/Bookmark";
import { IPostList } from "models/postModels/IPost";
import tag from "post/shared/tag";

interface HomeListItemProps {
  ListItemData: IPostList;
  section: string;
  height?: string;
}

const HOME_LIMIT = Number(process.env.REACT_APP_NUMBER_OF_POST_HOMELIST) || 12;

const HomeComponent: React.FC<HomeListItemProps> = ({
  ListItemData,
  section,
  height,
}) => {
  return (
    <div
      className="w-full text-base flex flex-col justify-center gap-2"
      style={{ height }}
    >
      <div className="flex flex-col justify-center gap-2">
        <h2>{startCase(section)}</h2>
        <hr className="border-t-2" />
      </div>
      <div className="h-full flex flex-col justify-between mr-1">
        <ul className="flex flex-col   ml-0 pr-0">
          {ListItemData.length > 0 &&
            Array.isArray(ListItemData) &&
            ListItemData?.slice(0, HOME_LIMIT).map((item, index) => (
              <React.Fragment key={index}>
                <li
                  className={`group inline-flex justify-between items-center min-h-7 ${tag(
                    section,
                    item.important_dates
                  )}`}
                >
                  <Link
                    to={`/sections/${section}/${
                      item.post
                        ? item.post.post_code
                        : snakeCase(item.name_of_the_post) //TODO: remove name of the post completly
                    }?is_saved=${item.is_saved}`}
                    state={{ postId: item._id }}
                    className="custom-link my-2"
                  >
                    {item.name_of_the_post}
                  </Link>
                  <Bookmark
                    section={section}
                    postId={item._id}
                    isSaved={item.is_saved}
                    classProp={`${
                      !item.is_saved && "hidden"
                    } group-hover:block`}
                  />
                </li>
                {index !== ListItemData.length - 1 && (
                  <hr className="text-custom-black" />
                )}
              </React.Fragment>
            ))}
        </ul>
        <Link
          className="text-custom-blue text-sm font-semibold pr-2 h-auto text-right"
          to={`/sections/${section}`}
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default HomeComponent;
