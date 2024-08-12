import React from "react";
import NewIcon from "src/assets/exam/newicon.gif"; // Assuming the correct path to your new icon
import "./Tag.css";

interface TagProps {
  last_updated?: Date;
}

const Tag: React.FC<TagProps> = ({ last_updated }) => {
  if (last_updated) {
    const createdDate: Date = new Date(last_updated);
    const currentDate: Date = new Date();
    const differenceInDays: number = Math.floor(
      (currentDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (differenceInDays <= 3) {
      return (
        <span className="tag_sec" style={{ color: "var(--color-green)" }}>
          <img src={NewIcon} alt="latest" />
        </span>
      );
    }
  }

  return <span className="tag_sec">Tag</span>;
};

export default Tag;
