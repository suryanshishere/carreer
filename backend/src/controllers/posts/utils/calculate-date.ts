import moment from "moment";
import { ISectionKey, TAG_DATE_MAP } from "@models/posts/db";
import { IDateRange, IDates } from "@models/posts/components/Date";

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
          formatDate(dateRange.current_year)
        );
      }
      if (dateRange.previous_year instanceof Date) {
        acc[key as keyof IDates].previous_year = new Date(
          formatDate(dateRange.previous_year)
        );
      }
    }
    return acc;
  }, {} as Record<keyof IDates, IDateRange>);
};

export const calculateDateDifference = (
  //this already having formated dates
  importantDates: Record<keyof IDates, IDateRange>,
  section: ISectionKey
) => {
  const tagKeys = TAG_DATE_MAP[section];
  const currentDate = moment();

  const { current_year: startCurr, previous_year: startPrev } =
    importantDates[tagKeys[0]] || {};
  const { current_year: endCurr, previous_year: endPrev } =
    importantDates[tagKeys[1]] || {};

  if (!startCurr || !startPrev) {
    return null;
  }

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

export const formatDateView = (
  stringValue: string
): { validDate: string | null; displayDate: string | null } => {
  const partialDateRegex = /\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(.\d+)?Z)?/;
  if (!partialDateRegex.test(stringValue))
    return { validDate: null, displayDate: null };

  const match = partialDateRegex.exec(stringValue);
  if (!match) return { validDate: null, displayDate: null };

  const extractedDate = match[0];
  const dateMoment = moment(extractedDate);
  const currentDate = moment();
  const currentYear = currentDate.year();
  const extractedYear = dateMoment.year();
  const monthDifference = dateMoment.diff(currentDate, "months", true);

  let formattedDate = "";
  let validDate = dateMoment.format("YYYY-MM-DD"); // Base valid date format
  const dateRender = dateMoment.format("Do MMMM YYYY");
  const dateMonth = dateMoment.format("MMMM");
  const nextYear = currentDate.clone().add(1, "years").year();
  const previousYear = currentDate.clone().add(-1, "years").year();
  const adjustedDate = dateMoment.clone().year(currentYear);
  const adjustedMonthDiff = adjustedDate.diff(currentDate, "months", true);
  const extractedMonth = dateMoment.month();

  // If the extracted date is in December, do not change the year unless the difference is greater than six months
  if (extractedMonth === 11 && Math.abs(monthDifference) <= 6) {
    formattedDate = dateRender;
    validDate = dateMoment.format("YYYY-MM-DD");
  } else if (extractedYear === currentYear) {
    formattedDate = dateRender;
  } else if (extractedYear > currentYear) {
    if (currentDate.month() !== 11) {
      formattedDate =
        adjustedMonthDiff < 0
          ? `${dateMonth}, ${currentYear}`
          : `${dateMonth}, ${currentYear} (Estimated)`;
      validDate = adjustedDate.format("YYYY-MM-DD");
    } else {
      formattedDate =
        monthDifference > 0
          ? `${dateMonth}, ${nextYear} (Estimated)`
          : `${dateMonth}, ${currentYear} (Estimated)`;
      validDate =
        monthDifference > 0
          ? dateMoment.clone().year(nextYear).format("YYYY-MM-DD")
          : adjustedDate.format("YYYY-MM-DD");
    }
  } else {
    if (currentDate.month() !== 0) {
      formattedDate =
        adjustedMonthDiff > 0 && adjustedMonthDiff < 1
          ? `Coming ${dateMonth}, ${currentYear}`
          : `${dateMonth}, ${currentYear}`;
      validDate = adjustedDate.format("YYYY-MM-DD");
    } else {
      formattedDate =
        monthDifference < 0
          ? `${dateMonth}, ${previousYear}`
          : `This ${dateMonth}, ${currentYear}`;
      validDate =
        monthDifference < 0
          ? dateMoment.clone().year(previousYear).format("YYYY-MM-DD")
          : adjustedDate.format("YYYY-MM-DD");
    }
  }

  return { validDate, displayDate: formattedDate };
};

type IDateRangeView = {
  current_year: string | null;
  previous_year: string | null;
};

export const formattedDateRefView = (
  dateRef: Record<keyof IDates, IDateRange> | null | undefined
): Record<keyof IDates, IDateRangeView> => {
  if (!dateRef) return {} as Record<keyof IDates, IDateRangeView>;

  return Object.keys(dateRef).reduce((acc, key) => {
    const dateRange = dateRef[key as keyof IDates];
    if (dateRange && typeof dateRange === "object") {
      let formattedCurrent: string | null = null;
      let formattedPrevious: string | null = null;

      // Process current_year field: if it's a Date, convert it to a display date string.
      if (dateRange.current_year instanceof Date) {
        const result = formatDateView(dateRange.current_year.toISOString());
        formattedCurrent = result.displayDate;
      }

      // Process previous_year field similarly.
      if (dateRange.previous_year instanceof Date) {
        const result = formatDateView(dateRange.previous_year.toISOString());
        formattedPrevious = result.displayDate;
      }

      acc[key as keyof IDates] = {
        current_year: formattedCurrent,
        previous_year: formattedPrevious,
      };
    }
    return acc;
  }, {} as Record<keyof IDates, IDateRangeView>);
};
