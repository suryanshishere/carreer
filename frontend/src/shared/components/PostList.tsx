import React from "react";
import { Link } from "react-router-dom";
import { IPostList, IPostListData } from "models/postModels/IPostList";
import Bookmark from "shared/components/Bookmark";
import { renderDateStrNum } from "../quick/render-date-str-num";
import flattenToLastKeys from "shared/quick/flatten-object";
import { snakeCase, startCase } from "lodash";
import { excludedKeys } from "post/post-detail-render-define";
import { excludedPostListKeys } from "post/post-list-render-define";
import { IDates } from "models/postModels/overallInterfaces/IDates";

interface ListProps {
  data: IPostList;
  section: string;
  isSaved?: boolean;
}

const CATEGORY_LIMIT =
  Number(process.env.REACT_APP_NUMBER_OF_POST_CATEGORYLIST) || 25;

const PostList: React.FC<ListProps> = ({ data, section, isSaved = false }) => {
  const calculateDateDifference = (itemData: IPostListData) => {
    const tagSectionMap: Record<string, string> = {
      result: "result_announcement_date",
      latest_job: "application_start_date",
    };

    const tagKey = tagSectionMap[section] as keyof IDates;
    const currentDate = new Date(); // Current date
    const resultDateString = (
      itemData.important_dates?.[tagKey] as { previous_year?: string }
    )?.previous_year;
    console.log(resultDateString);
    if (!resultDateString) {
      return 0;
    }

    const resultDate = new Date(resultDateString);

    // Extract day and month from both dates
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth(); // Months are zero-indexed in JS
    const resultDay = resultDate.getDate();
    const resultMonth = resultDate.getMonth(); // Months are zero-indexed in JS

    // Calculate difference in days and months
    const currentYear = currentDate.getFullYear();
    const resultYear = resultDate.getFullYear();

    // Check if the result date is earlier or later in the same year
    const isSameYear = resultYear === currentYear;

    let daysDifference;
    if (isSameYear) {
      if (currentMonth === resultMonth) {
        // Difference in the same month
        daysDifference = resultDay - currentDay;
      } else if (currentMonth > resultMonth) {
        // Result is in a past month
        const daysInResultMonth = new Date(
          currentYear,
          resultMonth + 1,
          0
        ).getDate();
        daysDifference = -(
          currentDay +
          daysInResultMonth -
          resultDay +
          (currentMonth - resultMonth - 1) * 30
        );
      } else {
        // Result is in a future month
        const daysInCurrentMonth = new Date(
          currentYear,
          currentMonth + 1,
          0
        ).getDate();
        daysDifference =
          daysInCurrentMonth -
          currentDay +
          resultDay +
          (resultMonth - currentMonth - 1) * 30;
      }
    } else {
      // Ignore the year, just calculate based on day/month
      const totalDaysInResultYear = new Date(resultYear, 11, 31).getDate();
      const totalDaysInCurrentYear = new Date(currentYear, 11, 31).getDate();

      if (currentMonth === resultMonth) {
        daysDifference = resultDay - currentDay;
      } else if (currentMonth > resultMonth) {
        daysDifference = -(
          currentDay +
          totalDaysInResultYear -
          resultDay +
          (currentMonth - resultMonth - 1) * 30
        );
      } else {
        daysDifference =
          totalDaysInCurrentYear -
          currentDay +
          resultDay +
          (resultMonth - currentMonth - 1) * 30;
      }
    }

    console.log(daysDifference);
    return daysDifference;
  };

  if (data.length === 0) return null;

  const renderObject = (obj: IPostListData) => {
    return Object.entries(obj)
      .filter(([key]) => !excludedPostListKeys.includes(key))
      .map(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          const nestedEntries = Object.entries(value);
          if (
            nestedEntries.every(
              ([_, nestedValue]) =>
                typeof nestedValue !== "object" || nestedValue === null
            )
          ) {
            return (
              <span key={key}>
                <span className="pl-2">{startCase(key)}:</span>
                <span className="pl-2">
                  {(value?.current_year || value?.previous_year) != null ? (
                    <span>
                      {renderDateStrNum(
                        `${
                          value.current_year ||
                          `${value.previous_year}`
                        }`,
                        key
                      )}
                    </span>
                  ) : (
                    <span key={key}>{renderObject(value)}</span>
                  )}
                </span>
              </span>
            );
          } else {
            return <span key={key}>{renderObject(value)}</span>;
          }
        } else {
          return (
            <span key={key} className="mr-2">
              <span>{startCase(key)}:</span>
              <span className="ml-1">{renderDateStrNum(value, key)}</span>
            </span>
          );
        }
      });
  };

  const calculateDate = (item: IPostListData) => {
    const days = calculateDateDifference(item);
    if (days > -15 && days < 0) {
      return <mark>RELEASED</mark>;
    }

    if (days > 15) {
      return <mark>EARLY</mark>;
    }

    if (days > -3 && days < 3) {
      return <mark>LIVE</mark>;
    }
  };

  return (
    <ul className="self-start p-0 m-0 flex flex-col gap-2 text-base">
      {data.map((item, index) => (
        <React.Fragment key={item._id}>
          <li className="w-fit ">
            <div className="flex gap-2 items-center">
              <Link
                to={`/sections/${section}/${snakeCase(
                  item.name_of_the_post
                )}?is_saved=${item.is_saved}`}
                state={{ postId: item._id }}
                className="text-custom-red underline decoration-1 underline-offset-2 visited:text-custom-gray  hover:decoration-custom-gray "
              >
                {item.name_of_the_post}
              </Link>
              {calculateDate(item)}
              <div className="self-end">
                <Bookmark
                  section={section}
                  postId={item._id}
                  isSaved={item.is_saved || isSaved}
                />
              </div>
            </div>
            <span className="text-custom-less-gray text-sm mr-2">
              <mark className="px-1 whitespace-nowrap bg-custom-pale-yellow">
                <span>Updated At:</span>
                <span className="ml-1">{renderDateStrNum(item.updatedAt)}</span>
              </mark>
              <span className="pl-2">{renderObject(item)}</span>
            </span>
          </li>
          {index !== data.length - 1 && (
            <hr className="w-full border-t-1 border-custom-less-gray" />
          )}
        </React.Fragment>
      ))}
    </ul>
  );
};

export default PostList;
