import moment from "moment";
import { ISectionKey, TAG_DATE_MAP } from "@models/posts/db";
import { IDateRange, IDates } from "@models/posts/components/Date";

export function formatDate(inputDate: string): string {
  const dateObj = new Date(inputDate);
  const now = new Date();
  const currMonth = now.getMonth();
  const currYear = now.getFullYear();
  const inputMonth = dateObj.getMonth();
  const inputDay = dateObj.getDate();

  let newYear = currYear;
  if (inputMonth <= 1 && currMonth >= 6) {
    newYear = currYear + 1;
  } else if (inputMonth >= 10 && currMonth <= 5) {
    newYear = currYear - 1;
  }

  const formattedMonth = String(dateObj.getMonth() + 1).padStart(2, "0");
  const formattedDay = String(inputDay).padStart(2, "0");

  const adjustedDate = new Date(
    `${newYear}-${formattedMonth}-${formattedDay}T00:00:00.000Z`
  );
  return adjustedDate.toISOString();
}

//formatted the date ref to have the key:date string format rather than current, previous format
//don't worry about future since backend will manage the interest of combining prev,curr correctly when needed.
export const formattedDateRef = (
  dateRef: Record<keyof IDates, IDateRange> | null | undefined
): Record<keyof IDates, IDateRange> => {
  if (!dateRef) return {} as Record<keyof IDates, IDateRange>;

  return Object.keys(dateRef).reduce((acc, key) => {
    const dateRange = dateRef[key as keyof IDates];
    if (dateRange && typeof dateRange === "object") {
      acc[key as keyof IDates] = { ...dateRange }; // Ensure object structure

      if (dateRange.current_year instanceof Date) {
        acc[key as keyof IDates].current_year = new Date(
          formatDate(dateRange.current_year.toISOString())
        );
      }
      if (dateRange.previous_year instanceof Date) {
        acc[key as keyof IDates].previous_year = new Date(
          formatDate(dateRange.previous_year.toISOString())
        );
      }
    }
    return acc;
  }, {} as Record<keyof IDates, IDateRange>);
};

export const calculateDateDifference = (
  importantDates: Record<keyof IDates, IDateRange>,
  section: ISectionKey
) => {
  const tagKeys = TAG_DATE_MAP[section];
  const currentDate = moment();

  const startDate = importantDates[tagKeys[0]];
  const endDate = importantDates[tagKeys[1]];

  let validStartDate: string | null = null;
  let validEndDate: string | null = null;

  if (tagKeys.length === 2) {
    const formattedStartDate = startDate
      ? formatDate(
          (startDate.current_year || startDate.previous_year).toISOString()
        )
      : null;

    const formattedEndDate = endDate
      ? formatDate(
          (endDate.current_year || endDate.previous_year).toISOString()
        )
      : null;

    validStartDate = formattedStartDate;
    validEndDate = formattedEndDate;
  } else {
    if (startDate) {
      const formattedCurrentYear = startDate.current_year
        ? formatDate(startDate.current_year.toISOString()) //formate date to right year (also consider corner case)
        : null;
      const formattedPreviousYear = startDate.previous_year
        ? formatDate(startDate.previous_year.toISOString())
        : null;

      validStartDate = formattedCurrentYear || formattedPreviousYear;
    }
  }

  if (!startDate) return null;
  const startMoment = moment(validStartDate, "YYYY-MM-DD");
  const endMoment = endDate ? moment(validEndDate, "YYYY-MM-DD") : null;

  // Case 1: The event is live (between start and end date)
  if (
    endMoment &&
    (currentDate.isSame(startMoment, "day") ||
      currentDate.isSame(endMoment, "day") ||
      currentDate.isBetween(startMoment, endMoment, undefined, "[]"))
  ) {
    //for expiring checks
    if (endMoment.diff(currentDate, "days") <= 3) {
      return 2000;
    }
    return 0;
  }

  // Case 2: The current date is before the start date (upcoming)
  if (currentDate.isBefore(startMoment)) {
    return startMoment.diff(currentDate, "days");
  }

  // Case 3: The current date is after the end date (past event)
  if (endMoment && currentDate.isAfter(endMoment)) {
    return -currentDate.diff(endMoment, "days") - 4; // for having endmoment, after expiring tag it should come under released that's why
  }

  const daysSinceStart = currentDate.diff(startMoment, "days");
  return currentDate.isAfter(startMoment) ? -daysSinceStart : daysSinceStart;
};
