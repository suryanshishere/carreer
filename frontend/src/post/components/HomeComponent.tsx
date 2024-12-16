import React from "react";
import { Link } from "react-router-dom";
import { IPostList } from "models/postModels/IPostList";
import { snakeCase, startCase } from "lodash";
import Bookmark from "shared/sharedPostComponents/Bookmark";
import Tag from "shared/sharedPostComponents/Tag";

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
  console.log(ListItemData);
  return (
    <div
      className="w-full text-base flex flex-col justify-center gap-2"
      style={{ height }}
    >
      <div className="flex flex-col justify-center gap-2">
        <h2 className="self-center py-1 text-custom-gray w-fit font-bold px-2 text-lg">
          {startCase(section)}
        </h2>
        <hr className="w-full border-t-2 border-custom-less-gray" />
      </div>
      <div className="h-full flex flex-col justify-between mr-1">
        <ul className="flex flex-col gap-2 ml-0 pr-0">
          {ListItemData?.slice(0, HOME_LIMIT).map((item, index) => (
            <React.Fragment key={index}>
              <li className="w-full">
                <div className="float-right flex items-center gap-1">
                  {item.important_dates && Tag(item.important_dates, section)}
                  <Bookmark
                    section={section}
                    postId={item._id}
                    isSaved={item.is_saved}
                  />
                </div>
                <Link
                  to={`/sections/${section}/${snakeCase(
                    item.name_of_the_post
                  )}?is_saved=${item.is_saved}`}
                  state={{ postId: item._id }}
                  className="text-custom-red underline decoration-1 underline-offset-2 visited:text-custom-gray hover:decoration-custom-gray"
                >
                  {item.name_of_the_post}
                </Link>
              </li>
              {index !== ListItemData.length - 1 && (
                <hr className="w-full border-t-1 border-custom-less-gray" />
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
