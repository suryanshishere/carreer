import moment from "moment";
import { TAG_SECTION_MAP } from "posts/db/renders";
import { formatDate } from "../render-post-data/RenderDate";
import { ISectionKey } from "posts/db";
import { IDateRange, IDates } from "posts/db/interfaces";

const calculateDateDifference = (
  importantDates: IDates,
  section: ISectionKey
) => {
  const tagKeys = TAG_SECTION_MAP[section];
  const currentDate = moment();

  let validStartDate: string | null = null;
  let validEndDate: string | null = null;
  const startDate = importantDates[tagKeys[0]] as IDateRange | undefined;
  const endDate = importantDates[tagKeys[1]] as IDateRange | undefined;

  if (tagKeys.length === 2) {
    const formattedStartDate = startDate
      ? formatDate(startDate.current_year || startDate.previous_year).validDate
      : null;

    const formattedEndDate = endDate
      ? formatDate(endDate.current_year || endDate.previous_year).validDate
      : null;

    validStartDate = formattedStartDate;
    validEndDate = formattedEndDate;
  } else {
    if (startDate) {
      const formattedCurrentYear = startDate.current_year
        ? formatDate(startDate.current_year).validDate
        : null;
      const formattedPreviousYear = startDate.previous_year
        ? formatDate(startDate.previous_year).validDate
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

  const daysSinceStart = currentDate.diff(startMoment, "days");
  return currentDate.isAfter(startMoment) ? -daysSinceStart : daysSinceStart;
};

export default calculateDateDifference;
