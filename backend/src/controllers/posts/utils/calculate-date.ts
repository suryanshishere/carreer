import moment from "moment";
import { ISectionKey, TAG_DATE_MAP } from "@models/posts/db";
import { IDates } from "@models/posts/components/Date";

function formatDate(inputDate: Date): Date {
  const dateObj = new Date(inputDate);

  const now = new Date();
  const currMonth = now.getMonth();
  const currYear = now.getFullYear();
  const inputMonth = dateObj.getMonth();

  let newYear = currYear;
  if (inputMonth <= 1 && currMonth >= 6) {
    newYear = currYear + 1;
  } else if (inputMonth >= 10 && currMonth <= 5) {
    newYear = currYear - 1;
  }

  dateObj.setFullYear(newYear);
  return dateObj;
}

export const calculateDateDifference = (
  importantDates: IDates,
  section: ISectionKey
) => {
  const tagKeys = TAG_DATE_MAP[section];
  const currentDate = moment();

  const startData = tagKeys[0] ? importantDates[tagKeys[0]] || {} : {};
  const endData =
    tagKeys.length > 1 && tagKeys[1] !== undefined
      ? importantDates[tagKeys[1]] || {}
      : {};

  let { current_year: startCurr, previous_year: startPrev } = startData;
  let { current_year: endCurr, previous_year: endPrev } = endData;

  startCurr = startCurr ? formatDate(startCurr) : undefined;
  startPrev = startPrev ? formatDate(startPrev) : undefined;
  endCurr = endCurr ? formatDate(endCurr) : undefined;
  endPrev = endPrev ? formatDate(endPrev) : undefined;

  const startMoment = moment(startCurr || startPrev, "YYYY-MM-DD");
  const endMoment = moment(endCurr || endPrev, "YYYY-MM-DD") || null;

  //The event is live (between start and end date)
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

  return startMoment.diff(currentDate, "days");
};

// date renaming for better view -------------------------

//TODO make the logic simple and readable
function formatDateView(stringValue: Date): string {
  const dateMoment = moment(stringValue);
  const currentDate = moment();
  const currentYear = currentDate.year();
  const currentMonth = currentDate.month();
  const extractedYear = dateMoment.year();
  const extractedMonth = dateMoment.month();
  const monthDiff = dateMoment.diff(currentDate, "months", true);
  const fullDateFormat = dateMoment.format("Do MMMM YYYY");
  const monthName = dateMoment.format("MMMM");

  // For December dates within 6 months difference or same-year dates, use full date format.
  if (extractedMonth === 11 && Math.abs(monthDiff) <= 6) return fullDateFormat;
  if (extractedYear === currentYear) return fullDateFormat;

  const nextYear = currentYear + 1;
  const prevYear = currentYear - 1;
  const adjustedMonthDiff = dateMoment
    .clone()
    .year(currentYear)
    .diff(currentDate, "months", true);

  if (extractedYear > currentYear) {
    if (currentMonth !== 11) {
      return adjustedMonthDiff < 0
        ? `${monthName}, ${currentYear}`
        : `${monthName}, ${currentYear} (Estimated)`;
    } else {
      return monthDiff > 0
        ? `${monthName}, ${nextYear} (Estimated)`
        : `${monthName}, ${currentYear} (Estimated)`;
    }
  } else {
    if (currentMonth !== 0) {
      return adjustedMonthDiff > 0 && adjustedMonthDiff < 1
        ? `Coming ${monthName}, ${currentYear}`
        : `${monthName}, ${currentYear}`;
    } else {
      return monthDiff < 0
        ? `${monthName}, ${prevYear}`
        : `This ${monthName}, ${currentYear}`;
    }
  }
}

export type IDateRangeView = {
  current_year: string | null;
  previous_year: string | null;
};

export const formattedDateRefView = (
  dateRef: IDates | null | undefined
): Record<keyof IDates, IDateRangeView> => {
  if (!dateRef) return {} as Record<keyof IDates, IDateRangeView>;

  return Object.keys(dateRef).reduce((acc, key) => {
    const dateRange = dateRef[key as keyof IDates];
    if (dateRange && typeof dateRange === "object") {
      let formattedCurrent: string | null = null;
      let formattedPrevious: string | null = null;

      // Process current_year field: if it's a Date, convert it to a display date string.
      if (dateRange.current_year instanceof Date) {
        formattedCurrent = formatDateView(dateRange.current_year);
      }

      // Process previous_year field similarly.
      if (dateRange.previous_year instanceof Date) {
        formattedPrevious = formatDateView(dateRange.previous_year);
      }

      acc[key as keyof IDates] = {
        current_year: formattedCurrent,
        previous_year: formattedPrevious,
      };
    }
    return acc;
  }, {} as Record<keyof IDates, IDateRangeView>);
};
