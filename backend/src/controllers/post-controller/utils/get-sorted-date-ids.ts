//date id sort upto 3 recent month, 5 previous year

import DateModel from "@models/post-model/components/Date";

const postSortMap: Record<string, string> = {
  result: "result_announcement_date",
  latest_job: "application_start_date",
  answer_key: "answer_key_release_date",
  syllabus: "application_start_date",
  certificate_verification: "certificate_verification_date",
  admission: "counseling_start_date",
  important: "important_date",
  admit_card: "admit_card_release_date",
};

const getSortedDateIds = async (section: string) => {
  const currentDate = new Date();

  // Calculate the start and end of the range for the current year
  const startOfPreviousMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  );

  const endOfNextMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 2,
    0
  );

  // Construct the query conditions dynamically
  const queryConditions = [];

  // Add conditions for `current_year` for the last 5 years
  for (let i = 0; i <= 5; i++) {
    const startOfPreviousMonthYear = new Date(
      startOfPreviousMonth.getFullYear() - i,
      startOfPreviousMonth.getMonth(),
      startOfPreviousMonth.getDate()
    );

    const endOfNextMonthYear = new Date(
      endOfNextMonth.getFullYear() - i,
      endOfNextMonth.getMonth(),
      endOfNextMonth.getDate()
    );

    // Check `current_year` for this year
    queryConditions.push({
      [`${postSortMap[section]}.current_year`]: {
        $gte: startOfPreviousMonthYear,
        $lte: endOfNextMonthYear,
      },
    });
  }

  // Add fallback conditions for `previous_year` for the last 5 years
  for (let i = 0; i <= 5; i++) {
    const startOfPreviousMonthYear = new Date(
      startOfPreviousMonth.getFullYear() - i,
      startOfPreviousMonth.getMonth(),
      startOfPreviousMonth.getDate()
    );

    const endOfNextMonthYear = new Date(
      endOfNextMonth.getFullYear() - i,
      endOfNextMonth.getMonth(),
      endOfNextMonth.getDate()
    );

    // Check `previous_year` for this year
    queryConditions.push({
      [`${postSortMap[section]}.previous_year`]: {
        $gte: startOfPreviousMonthYear,
        $lte: endOfNextMonthYear,
      },
    });
  }

  const query = { $or: queryConditions };

  const sortedDateIds = await DateModel.find(query)
    .select("_id") // Only fetch the IDs
    .lean();

  return sortedDateIds.map((date) => date._id); // Return an array of IDs
};

export default getSortedDateIds;
