import { Link } from "react-router-dom";
import Bookmark from "./Bookmark";
import { ICommonListData } from "posts/db/interfaces";
import { ISectionKey } from "posts/db"; 

interface PostItemProps {
  section: ISectionKey;
  item: ICommonListData; 
}

const PostLinkItem: React.FC<PostItemProps> = ({ section, item }) => {
  const refKey = `${section}_ref` as keyof ICommonListData;
  const refData = item[refKey] as { name_of_the_post: string } | undefined;
  return (
    <div className="w-full min-h-7">
      <Bookmark
        section={section}
        postId={item._id!}
        isSaved={item.is_saved}
        classProp={`block float-right ${
          !item.is_saved ? "mobile:hidden group-hover:block" : ""
        }`}
      />
      <Link
        to={`/sections/${section}/${item.post_code}/${item.version ?? "main"}`}
        state={{ postId: item._id }}
        className="custom_link"
      >
        {refData?.name_of_the_post ?? "Unnamed Post"}
      </Link> 
    </div>
  );
};

export default PostLinkItem;
