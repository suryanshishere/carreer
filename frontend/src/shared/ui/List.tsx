import React from "react";
// import Bookmark from "../utils/Bookmark";
import { Link } from "react-router-dom";
import { IPostList } from "models/postModels/IPostList";
// import Delete from "../utils/Delete";
import "./List.css";
import Bookmark from "shared/components/Bookmark";
import { renderDateStrNum } from "./render-date-str-num";
// import { startCase } from "lodash";

interface ListProps {
  data: IPostList;
  section: string;
}

//since, same this list component can be used by various other page like saved, category.

const CATEGORY_LIMIT =
  Number(process.env.REACT_APP_NUMBER_OF_POST_CATEGORYLIST) || 25;

const List: React.FC<ListProps> = ({ data, section }) => {
  return (
    <ul className="w-full self-start p-0 m-0 text-base">
      {data.map((item, index) => (
        <React.Fragment key={item._id}>
          <li className="w-fit flex flex-col">
            <div className="flex gap-2 items-center">
              <Link
                to={`/sections/${section}/${item._id}?is_saved=${item.is_saved}`}
                className="text-custom-red underline decoration-1 underline-offset-2 hover:decoration-custom-gray"
              >
                {item.name_of_the_post}
              </Link>
              <div className="self-end">
                <Bookmark
                  section={section}
                  postId={item._id}
                  isSaved={item.is_saved}
                />
              </div>
            </div>

            <h5 className="text-custom-less-gray no-whitespace-nowrap w-fit flex gap-1 text-sm pt-1 pl-2">
              Last Updated:{" "}
              <span className="text-custom-black">
                {renderDateStrNum(item.updatedAt)}
              </span>
            </h5>
            {/* <p className="text-custom-less-gray no-whitespace-nowrap w-fit flex gap-1 text-sm pt-1 pl-2">
             {renderDateStrNum(item.short_information)}
            </p> */}
          </li>
          {index !== data.length - 1 && (
            <hr className="w-full border-t-1 border-custom-less-gray" />
          )}
        </React.Fragment>
      ))}
    </ul>
  );
};

export default List;
