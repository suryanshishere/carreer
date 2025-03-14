import { ITagKey, TAGS } from "users/db";

const Tag: React.FC<{ tag: ITagKey }> = ({ tag }) => {
  return (
    <span
      className={`min-h-full w-1 mr-2 flex-none ${
        TAGS[tag] ? `bg-${TAGS[tag]}` : "hidden"
      }`}
    ></span>
  );
};

export default Tag;
