import { IDates } from "posts/db/interfaces";
import { USER_ACCOUNT_MODE_DB } from "users/db";
import { ISectionKey } from "posts/db";
import calculateDateDifference from "./calculate-date-diff";

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
