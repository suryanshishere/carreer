import { Link } from "react-router-dom";
import Bookmark from "./Bookmark";
import { ICommonListData } from "post/db/interfaces";

interface PostItemProps {
  section: string;
  item: ICommonListData;
}

const PostLinkItem: React.FC<PostItemProps> = ({ section, item }) => {
  // Build the key dynamically. For instance, if section is "syllabus", this becomes "syllabus_ref".
  const refKey = `${section}_ref` as keyof ICommonListData;
  // Cast the value to the expected type
  const refData = item[refKey] as { name_of_the_post: string } | undefined;

  return (
    <div className="w-full min-h-7">
      <Bookmark
        section={section}
        postId={item._id!}
        isSaved={item.is_saved!}
        classProp={`block float-right ${
          !item.is_saved ? "mobile:hidden group-hover:block" : ""
        }`}
      />
      <Link
        to={`/sections/${section}/${item.post_code}/${
          item.version ?? "main"
        }?is_saved=${item.is_saved}`}
        state={{ postId: item._id }}
        className="custom-link"
      >
        {refData?.name_of_the_post ?? "Unnamed Post"}
      </Link>
    </div>
  );
};

export default PostLinkItem;
