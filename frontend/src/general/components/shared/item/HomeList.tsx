import React from "react";
import { Link } from "react-router-dom";
import { IPostListData } from "models/post/IPostList";
import Card from "shared/components/uiElements/cover/Card";
// import Bookmark from "src/shared/components/utils/Bookmark";
import SampleLoad from "shared/components/uiElements/common/SampleLoad";
import "./HomeList.css";
import { formatWord } from "shared/components/uiElements/uihelpers/format-word";
// import Tag from "src/shared/components/uiElements/common/Tag";

interface HomeListItemProps {
  ListItemData: IPostListData[];
  category?: string;
  categoryTitle?: string;
  height?: string;
}

const HomeListItem: React.FC<HomeListItemProps> = ({
  ListItemData,
  category,
  categoryTitle,
  height,
}) => {
  return (
    <div
      className="w-auto flex flex-col justify-between overflow-hidden max-h-260"
      style={{ height }}
    >
      <div className="overflow-hidden links_list_sec">
        <h5 style={{}} className="text-center capitalize p-3 ">
          {categoryTitle}
        </h5>
        <hr />
        <ul className="links_ul flex flex-col gap-1 ml-0 pr-0">
          {ListItemData.length === 0 ? (
            <SampleLoad />
          ) : (
            ListItemData?.slice(0, 10).map((item, index) => (
              <React.Fragment key={index}>
                <li>
                  <Link
                    className="links_ul_a no-underline"
                    to={`/category/${category}/${item.post_code}`}
                  >
                    {formatWord(item.name_of_the_post)}
                  </Link>
                  {/* <Tag last_updated={item.last_updated } /> */}
                  {/* <Bookmark itemId={item._id} bookmarked={item.bookmarked} /> */}
                </li>
                {index !== ListItemData.length - 1 && <hr />}
              </React.Fragment>
            ))
          )}
        </ul>
      </div>
      <Link
        className="read_more mr-4 mb-3 self-end font-bold float-right"
        to={`/category/${category}`}
      >
        Read More
      </Link>
    </div>
  );
};

export default HomeListItem;
