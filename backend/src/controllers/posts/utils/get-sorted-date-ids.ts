import DateModel from "@models/posts/components/Date";
import { ISectionKey, TAG_DATE_MAP } from "@models/posts/db";

const getSortedDateIds = async (section: ISectionKey) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // Define boundaries using computed MM-DD values.
  // For example, if today is March 15, then:
  //   - Start boundary is the 1st of the previous month
  //   - End boundary is the last day of the next month
  const startDate = new Date(currentYear, currentDate.getMonth() - 1, 1);
  const endDate = new Date(currentYear, currentDate.getMonth() + 2, 0);

  const formatMMDD = (d: Date) =>
    ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);

  const startMMDD = formatMMDD(startDate);
  const endMMDD = formatMMDD(endDate);

  // Allowed years: current, and the two previous ones.
  const allowedYears = [currentYear, currentYear - 1, currentYear - 2];

  // Get the list of fields to check for this section.
  const fieldsToCheck = TAG_DATE_MAP[section] || [];
  if (!fieldsToCheck.length) return [];

  // Build OR conditions for each field:
  // - One condition uses the computed current_year values.
  // - The other uses the fallback previous_year values.
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

  // Run the query with the OR conditions.
  const sortedDateIds = await DateModel.find({ $or: orConditions })
    .select("_id")
    .lean();

  return sortedDateIds.map((doc) => String(doc._id));
};

export default getSortedDateIds;
