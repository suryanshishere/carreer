import DateModel from "@models/posts/components/Date";
import { ISectionKey, TAG_DATE_MAP } from "@models/posts/db";

const getSortedDateIds = async (section: ISectionKey) => {
  const currentDate = new Date();

  // Start of the previous month (1st day)
  const startOfPreviousMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  );

  // End of the next month (last day)
  const endOfNextMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 2,
    0
  );

  // Get the relevant date fields for the section
  const fieldsToCheck = TAG_DATE_MAP[section] || [];

  if (fieldsToCheck.length === 0) {
    return []; // No valid fields, return empty
  }

  // Construct query conditions dynamically
  const queryConditions: Array<Record<string, any>> = [];

  for (let i = 0; i <= 5; i++) {
    const adjustedStart = new Date(
      startOfPreviousMonth.getFullYear() - i,
      startOfPreviousMonth.getMonth(),
      startOfPreviousMonth.getDate()
    );

    const adjustedEnd = new Date(
      endOfNextMonth.getFullYear() - i,
      endOfNextMonth.getMonth(),
      endOfNextMonth.getDate()
    );

    fieldsToCheck.forEach((field) => {
      queryConditions.push(
        {
          [`${field}.current_year`]: { $gte: adjustedStart, $lte: adjustedEnd },
        },
        {
          [`${field}.previous_year`]: {
            $gte: adjustedStart,
            $lte: adjustedEnd,
          },
        }
      );
    });
  }

  // Run query with OR condition on all fields
  const sortedDateIds = await DateModel.find({ $or: queryConditions })
    .select("_id")
    .lean();

  return sortedDateIds.map((date) => String(date._id));
};

export default getSortedDateIds;
