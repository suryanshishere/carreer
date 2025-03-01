import { Link } from "react-router-dom";
import Bookmark from "./Bookmark";
import { snakeCase } from "lodash";

interface PostItemProps {
  section: string;
  item: {
    _id: string;
    is_saved: boolean;
    name_of_the_post: string;
    post?: {
      post_code: string;
    };
  };
}

const PostLinkItem: React.FC<PostItemProps> = ({ section, item }) => {
  return (
    <div className="w-full min-h-7">
      <Bookmark
        section={section}
        postId={item._id}
        isSaved={item.is_saved}
        classProp={`block float-right ${
          !item.is_saved ? "mobile:hidden group-hover:block" : ""
        }`}
      />
      <Link
        to={`/sections/${section}/${
          item.post ? item.post.post_code : snakeCase(item.name_of_the_post)
        }?is_saved=${item.is_saved}`}
        state={{ postId: item._id }}
        className="custom-link"
      >
        {item.name_of_the_post}
      </Link>
    </div>
  );
};

export default PostLinkItem;
