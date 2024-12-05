import React from "react";
import { Link } from "react-router-dom";
import { IPostList } from "models/postModels/IPostList";
import { startCase } from "lodash";
import Bookmark from "shared/components/Bookmark";

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
      className="w-full text-base flex flex-col overflow-hidden max-h-260 gap-2"
      style={{ height }}
    >
      <div className="w-full">
        <h5 className="text-center font-bold capitalize py-2">
          {startCase(section)}
        </h5>
        <hr className="w-full border-t-2 border-custom-less-gray" />
      </div>
      <div className="h-full flex flex-col justify-between mr-1">
        <ul className="flex flex-col gap-2 ml-0 pr-0">
          {ListItemData?.slice(0, HOME_LIMIT).map((item, index) => (
            <React.Fragment key={index}>
              <li className="w-full">
                <div className="float-right">
                  <Bookmark
                    section={section}
                    postId={item._id}
                    isSaved={item.is_saved}
                  />
                </div>
                <Link
                  to={`/sections/${section}/${item._id}?is_saved=${item.is_saved}`}
                  className="text-custom-red underline decoration-1 underline-offset-2 hover:text-custom-blue"
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
