import React from "react";
import { Link } from "react-router-dom";
import { IPostListData } from "models/post/IPostList";
import SampleLoad from "shared/uiComponents/common/SampleLoad";
import { formatWord } from "shared/uiComponents/uiUtilComponents/format-word";
import "./HomeComponent.css";

interface HomeListItemProps {
  ListItemData: IPostListData[];
  category?: string;
  height?: string;
}

const HOME_LIMIT = Number(process.env.REACT_APP_NUMBER_OF_POST_HOMELIST) || 12

const HomeComponent: React.FC<HomeListItemProps> = ({
  ListItemData,
  category,
  height,
}) => {

  return (
    <div
      className="w-auto flex flex-col justify-between overflow-hidden max-h-260"
      style={{ height }}
    >
      <div className="overflow-hidden links_list_sec">
        <h5 style={{}} className="text-start font-bold capitalize p-3 ">
          {category && formatWord(category)}
        </h5>
        <hr />
        <ul className="links_ul flex flex-col gap-1 ml-0 pr-0">
          {ListItemData.length === 0 ? (
            <SampleLoad />
          ) : (
            ListItemData?.slice(0, HOME_LIMIT).map((item, index) => (
              <React.Fragment key={index}>
                <li>
                  <Link
                    className="links_ul_a no-underline"
                    to={`/category/${category}/${item._id}`}
                  >
                    {item.name_of_the_post}
                  </Link>
                </li>
                {index !== ListItemData.length - 1 && <hr />}
              </React.Fragment>
            ))
          )}
        </ul>
      </div>
      <Link
        className="text-custom-red mr-4 mb-3 self-end float-right"
        to={`/category/${category}`}
      >
        Read More
      </Link>
    </div>
  );
};

export default HomeComponent;
