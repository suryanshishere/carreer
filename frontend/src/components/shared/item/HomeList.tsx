import React from "react";
import { Link } from "react-router-dom";
import { ExamListItem } from "src/models/exam/ListProps";
import Card from "src/shared/components/uiElements/cover/Card";
// import Bookmark from "src/shared/components/utils/Bookmark";
import SampleLoad from "src/shared/components/uiElements/common/SampleLoad";
import "./HomeList.css";
import { formatWord } from "src/helpers/FormatWord";
// import Tag from "src/shared/components/uiElements/common/Tag";

interface HomeListItemProps {
  ListItemData: ExamListItem[];
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
    <Card
      className="w-auto flex flex-col justify-between overflow-hidden max-h-260"
      style={{ height }}
    >
      <div className="overflow-hidden links_list_sec">
        <h5 className="text-center capitalize p-3 ">{categoryTitle}</h5>
        <hr />
        <ul className="links_ul flex flex-col gap-1 ml-2">
          {ListItemData.length === 0 ? (
            <SampleLoad />
          ) : (
            ListItemData?.slice(0, 10).map((item, index) => (
              <React.Fragment key={item._id}>
                <li>
                  <Link
                    className="links_ul_a no-underline"
                    to={`/category/${category}/${item.name_of_the_post}`}
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
    </Card>
  );
};

export default HomeListItem;
