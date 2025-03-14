import moment from "moment";
import { ISectionKey, TAG_DATE_MAP } from "@models/posts/db";
import { IDateRange, IDates } from "@models/posts/components/Date";

const formatDate = (
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

const calculateDateDifference = (
  importantDates: Partial<IDates>,
  section: ISectionKey
) => {
  const tagKeys = TAG_DATE_MAP[section];
  const currentDate = moment();

  let validStartDate: string | null = null;
  let validEndDate: string | null = null;
  const startDate = importantDates[tagKeys[0]] as IDateRange | undefined;
  const endDate = importantDates[tagKeys[1]] as IDateRange | undefined;

  if (tagKeys.length === 2) {
    const formattedStartDate = startDate
      ? formatDate(
          (startDate.current_year || startDate.previous_year).toISOString()
        ).validDate
      : null;

    const formattedEndDate = endDate
      ? formatDate(
          (endDate.current_year || endDate.previous_year).toISOString()
        ).validDate
      : null;

    validStartDate = formattedStartDate;
    validEndDate = formattedEndDate;
  } else {
    if (startDate) {
      const formattedCurrentYear = startDate.current_year
        ? formatDate(startDate.current_year.toISOString()).validDate //formate date to right year (also consider corner case)
        : null;
      const formattedPreviousYear = startDate.previous_year
        ? formatDate(startDate.previous_year.toISOString()).validDate
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

export default calculateDateDifference;
