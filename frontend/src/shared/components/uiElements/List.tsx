import React from "react";
// import Bookmark from "../utils/Bookmark";
import { Link } from "react-router-dom";
import { PostData } from "models/post/IPostList";
import Delete from "../utils/Delete";
import SampleLoad from "./common/SampleLoad";
import "./List.css";
import { formatWord } from "shared/components/uiElements/uihelpers/format-word";

interface ListProps {
  currentRecords: PostData[];
  showBookmark?: boolean;
  showCategory?: boolean;
  showDelete?: boolean;
  onSavedDelete?: (id: string | number) => void;
}

const List: React.FC<ListProps> = ({
  currentRecords,
  showCategory,
  showBookmark = true,
  showDelete,
  onSavedDelete,
}) => {
  const handleDelete = (id: string | number) => {
    if (onSavedDelete) {
      onSavedDelete(id);
    }
  };

  return (
    <ul className="w-full self-start p-0 m-0">
      {currentRecords.length === 0 ? (
        <SampleLoad />
      ) : (
        currentRecords?.map((item, index) => (
          <React.Fragment key={index}>
            <li className="flex items-center justify-between gap-4">
              <div className="flex gap-2 p-2">
                <h6
                  className="m-0 mt-1 p-1"
                  style={{
                    color: "var(--color-brown)",
                    fontSize: "var(--font-faint-size)",
                  }}
                >
                  11/11/2003
                </h6>
                <div className="list_link flex items-center gap-1" >
                  {/* <Link to={`/category/${item.category}/${item._id}`}> */}
                    {/* {item.name_of_the_post} */}
                  {/* </Link> */}
                  {/* {showBookmark && (
                    <Bookmark bookmarked={item.bookmarked} itemId={item._id} />
                  )} */}
                </div>
              </div>
              <div className="list_li_util flex content-center">
                {/* {showCategory && <header>{formatWord(item.category)}</header>}
                {showDelete && (
                  <Delete itemId={item._id} onDelete={handleDelete} />
                )} */}
              </div>
            </li>
            {index !== currentRecords.length - 1 && <hr />}
          </React.Fragment>
        ))
      )}
    </ul>
  );
};

export default List;
