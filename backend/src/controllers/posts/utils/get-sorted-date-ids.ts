import DateModel from "@models/posts/components/Date";
import { ISectionKey, TAG_DATE_MAP } from "@models/posts/db";

const getSortedDateIds = async (
  section: ISectionKey,
  page: number = 1
): Promise<{ sortedDateIds: string[]; pageNumber: number | null }> => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Calculate shifted month (ignoring year changes)
  const shiftedMonth = currentMonth - 3 * (page - 1);
  const normalizedMonth = ((shiftedMonth % 12) + 12) % 12;

  // Convert normalized month to an "effective" month relative to the current month.
  // If the normalized month is greater than the current month, assume it came from a previous year.
  const effectiveShiftedMonth =
    normalizedMonth > currentMonth ? normalizedMonth - 12 : normalizedMonth;

  // For page 1, force hasMoreData to true; for later pages, if the effective month is not less than currentMonth, stop.
  const hasMoreData = page === 1 ? true : effectiveShiftedMonth < currentMonth;

  if (!hasMoreData) {
    return { sortedDateIds: [], pageNumber: null };
  }

  // Create shifted date using current year and day, but with the computed month.
  const shiftedDate = new Date(
    currentYear,
    normalizedMonth,
    currentDate.getDate()
  );

  // Define boundaries relative to the shifted date:
  // Start: 1st of the month before the shifted month
  // End: last day of the month after the shifted month
  const startDate = new Date(currentYear, shiftedDate.getMonth() - 1, 1);
  const endDate = new Date(currentYear, shiftedDate.getMonth() + 2, 0);

  const formatMMDD = (d: Date) =>
    ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);

  const startMMDD = formatMMDD(startDate);
  const endMMDD = formatMMDD(endDate);

  // Allowed years – using current year and the two previous years.
  const allowedYears = [currentYear, currentYear - 1, currentYear - 2];

  // Get the list of fields to check for this section.
  const fieldsToCheck = TAG_DATE_MAP[section] || [];
  if (!fieldsToCheck.length) return { sortedDateIds: [], pageNumber: page };

  // Build OR conditions for each field.
  const orConditions = fieldsToCheck.flatMap((field) => [
    {
      [`${field}.current_mmdd`]: { $gte: startMMDD, $lte: endMMDD },
      [`${field}.current_year_val`]: { $in: allowedYears },
    },
    {
      [`${field}.previous_mmdd`]: { $gte: startMMDD, $lte: endMMDD },
      [`${field}.previous_year_val`]: { $in: allowedYears },
    },
  ]);

  // Run the query.
  const sortedDateIds = await DateModel.find({ $or: orConditions })
    .select("_id")
    .lean();

  // If no data is found and we're beyond page 1, recursively try the next page.
  //TODO: one bug is there: non approved post ids there and it's making below code stop
  if (sortedDateIds.length === 0) {
    return getSortedDateIds(section, page + 1);
  }

  return {
    sortedDateIds: sortedDateIds.map((doc) => String(doc._id)),
    pageNumber: page,
  };
};

export default getSortedDateIds;
