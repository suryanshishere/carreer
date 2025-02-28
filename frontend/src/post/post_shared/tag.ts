import POST_DB from "post/post_db";
import { IDateRange, IDates } from "models/postModels/overallInterfaces/IDates";
import moment from "moment";
import { formatDate } from "./render_post_data/render_date";

const calculateDateDifference = (importantDates: IDates, section: string) => {
  const tagSectionMap: Record<string, (keyof IDates)[]> = {
    result: ["result_announcement_date"],
    latest_job: ["application_start_date", "application_end_date"],
    answer_key: ["answer_key_release_date"],
    syllabus: ["application_start_date", "application_end_date"],
    certificate_verification: ["certificate_verification_date"],
    admission: ["counseling_start_date", "counseling_end_date"],
    important: ["important_date"],
    admit_card: ["admit_card_release_date"],
  };

  const tagKeys = tagSectionMap[section];
  if (!tagKeys) return null;

  const currentDate = moment();

  let validStartDate: string | null = null;
  let validEndDate: string | null = null;

  if (tagKeys.length === 2) {
    const startDate = importantDates[tagKeys[0]] as IDateRange | undefined;
    const endDate = importantDates[tagKeys[1]] as IDateRange | undefined;

    const formattedStartDate = startDate?.current_year
      ? formatDate(startDate.current_year)
      : startDate?.previous_year
      ? formatDate(startDate.previous_year)
      : null;

    const formattedEndDate = endDate?.current_year
      ? formatDate(endDate.current_year)
      : endDate?.previous_year
      ? formatDate(endDate.previous_year)
      : null;

    validStartDate = formattedStartDate?.validDate || null;
    validEndDate = formattedEndDate?.validDate || null;
  } else {
    const dateRange = importantDates[tagKeys[0]] as IDateRange | undefined;
    if (dateRange) {
      const formattedDate = dateRange.current_year
        ? formatDate(dateRange.current_year)
        : dateRange.previous_year
        ? formatDate(dateRange.previous_year)
        : null;
      validStartDate = formattedDate?.validDate || null;
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
    // for expiring check
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
    return currentDate.diff(endMoment, "days");
  }

  // If there's only a start date but no end date, return the days since the start
  return currentDate.diff(startMoment, "days");
};

const tag = (section: string, importantDates?: IDates) => {
  if (!importantDates) return "";

  const days = calculateDateDifference(importantDates, section);
  if (days === null) return "";

  // Find the matching tag based on the number of days
  const matchingTag = POST_DB.tags.find(
    (tag) =>
      tag.daysRange && days >= tag.daysRange[0] && days <= tag.daysRange[1]
  );

  // Return the styled tag if a label is assigned
  return matchingTag ? `pl-2 border-l-2 border-${matchingTag?.color}` : "";
};

export default tag;
