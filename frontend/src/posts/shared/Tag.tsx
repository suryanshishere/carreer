import { IDateRange, IDates } from "posts/db/interfaces";
import moment from "moment";
import { formatDate } from "./render-post-data/RenderDate";
import { USER_ACCOUNT_MODE_DB } from "users/db";
import { TAG_SECTION_MAP } from "posts/db/renders";
import { ISectionKey } from "posts/db";

const calculateDateDifference = (
  importantDates: IDates,
  section: ISectionKey
) => {
  const tagKeys = TAG_SECTION_MAP[section];
  const currentDate = moment();

  let validStartDate: string | null = null;
  let validEndDate: string | null = null;

  if (tagKeys.length === 2) {
    const startDate = importantDates[tagKeys[0]] as IDateRange | undefined;
    const endDate = importantDates[tagKeys[1]] as IDateRange | undefined;

    const formattedStartDate = startDate
      ? formatDate(startDate.current_year || startDate.previous_year || "")
          .validDate
      : null;

    const formattedEndDate = endDate
      ? formatDate(endDate.current_year || endDate.previous_year || "")
          .validDate
      : null;

    validStartDate = formattedStartDate;
    validEndDate = formattedEndDate;
  } else {
    const dateRange = importantDates[tagKeys[0]] as IDateRange | undefined;
    if (dateRange) {
      const formattedCurrentYear = dateRange.current_year
        ? formatDate(dateRange.current_year).validDate
        : null;
      const formattedPreviousYear = dateRange.previous_year
        ? formatDate(dateRange.previous_year).validDate
        : null;

      validStartDate = formattedCurrentYear || formattedPreviousYear;
    }
  }

  if (!validStartDate) return null; // No valid date found

  const startMoment = moment(validStartDate, "YYYY-MM-DD");
  const endMoment = validEndDate ? moment(validEndDate, "YYYY-MM-DD") : null;

  // Case 1: The event is live (between start and end date)
  if (
    endMoment &&
    currentDate.isBetween(startMoment, endMoment, undefined, "[]")
  ) {
    if (endMoment.diff(currentDate, "days") <= 3) {
      return 2812;
    }
    return 0;
  }

  // Case 2: The current date is before the start date (upcoming)
  if (currentDate.isBefore(startMoment)) {
    return startMoment.diff(currentDate, "days");
  }

  // Case 3: The current date is after the end date (past event)
  if (endMoment && currentDate.isAfter(endMoment)) {
    return -currentDate.diff(endMoment, "days"); // Now correctly handling negative values
  }

  // If there's only a start date but no end date, return the days since the start
  return currentDate.diff(startMoment, "days");
};

const Tag: React.FC<{ section: ISectionKey; importantDates?: IDates }> = ({
  section,
  importantDates,
}) => {
  if (!importantDates) return null;

  const days = calculateDateDifference(importantDates, section);
  if (days === null) return null;

  console.log(days, section, importantDates);

  // Find the matching entry that contains both key and tag
  const matchingTagEntry = Object.entries(USER_ACCOUNT_MODE_DB.tags).find(
    ([key, tag]) =>
      tag.daysRange && days >= tag.daysRange[0] && days <= tag.daysRange[1]
  );

  // Destructure the key and the tag if found
  let tagKey, matchingTag;
  if (matchingTagEntry) {
    [tagKey, matchingTag] = matchingTagEntry;
  }

  return (
    <span
      className={`min-h-full w-1 mr-2 flex-none ${
        matchingTag ? `bg-${matchingTag.color}` : ""
      }`}
    ></span>
  );
};

export default Tag;

//for tag filtering feature where matching with store mode boolean and return true or false if matches.
export const shouldDisplayTag = (
  importantDates: IDates,
  section: ISectionKey,
  userTags: Record<string, boolean>
): boolean => {
  //by chance usertags not loaded
  // If all userTags are false (and the object is not empty), return true regardless.
  const userTagsValues = Object.values(userTags);
  if (
    !userTags ||
    (userTagsValues.length > 0 &&
      userTagsValues.every((value) => value === false))
  ) {
    return true;
  }

  // Calculate the difference in days using the provided dates and section.
  const days = calculateDateDifference(importantDates, section);
  if (days === null) return false;

  // Find the matching tag entry from the DB based on the days.
  const matchingTagEntry = Object.entries(USER_ACCOUNT_MODE_DB.tags).find(
    ([key, tag]) =>
      tag.daysRange && days >= tag.daysRange[0] && days <= tag.daysRange[1]
  );

  // If no matching tag is found, do not display.
  if (!matchingTagEntry) return false;

  // Destructure to get the tag key.
  const [tagKey] = matchingTagEntry;

  // Otherwise, check if the specific tag is enabled in the user's tags.
  return Boolean(tagKey && userTags[tagKey]);
};
