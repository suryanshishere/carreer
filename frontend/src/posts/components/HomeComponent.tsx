import React from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import Tag from "posts/shared/Tag";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import { HomeSkeletonLoad } from "posts/shared/SkeletonLoad";
import PostLinkItem from "posts/shared/PostLinkItem";
import { ICommonListData } from "posts/db/interfaces";
import { ISectionKey } from "posts/db";

interface HomeListItemProps {
  data: ICommonListData[];
  section: ISectionKey;
  height?: string;
}

// const HOME_LIMIT = Number(process.env.REACT_APP_NUMBER_OF_POST_HOMELIST) || 12;

// Function to determine the number of skeleton items based on height
const getSkeletonItemCount = (height: string | undefined) => {
  if (height) {
    const numericHeight = parseInt(height, 10);
    if (numericHeight > 50) {
      return 10;
    }
  }
  return 6;
};

const HomeComponent: React.FC<HomeListItemProps> = ({
  data,
  section,
  height,
}) => {
  const userTags = useSelector(
    (state: RootState) => state.user.mode.tags || {}
  );
  const skeletonItemCount = getSkeletonItemCount(height);

  return (
    <div className="w-full text-base flex flex-col gap-1" style={{ height }}>
      <div className="flex flex-col justify-center items-center gap-2">
        <h2 className="w-full text-center">{_.startCase(section)}</h2>
      </div>
      <hr />
      <hr className="mb-2"/>
      <div className="flex flex-col justify-between h-full">
        {data.length === 0 ? (
          <ul className="flex flex-col gap-3">
            {Array.from({ length: skeletonItemCount }).map((_, index) => (
              <HomeSkeletonLoad key={index} />
            ))}
          </ul>
        ) : (
          <>
            <ul className="flex flex-col gap-[6px]">
              {data.map((item, index) => {
                if (!userTags["none"] && !userTags[item.tag]) {
                  return null;
                }

                return (
                  <React.Fragment key={item._id}>
                    <li className="group inline-flex justify-start items-center min-h-7">
                      <Tag tag={item.tag} />
                      <PostLinkItem section={section} item={item} />
                    </li>
                    {index !== data.length - 1 && <hr />}
                  </React.Fragment>
                );
              })}
            </ul>
            <Link
              className="text-custom_blue text-sm font-semibold pr-2 h-auto text-right self-end"
              to={`/sections/${section}`}
            >
              Read More
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default HomeComponent;
