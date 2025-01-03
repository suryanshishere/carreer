import React from "react";
import { IDates } from "models/postModels/overallInterfaces/IDates";
import moment from "moment";
import TAGS from "db/postDb/tags.json";

interface TagProps {
  importantDates?: IDates;
  section: string;
  classProp?: string; // Optional prop for custom styling
}

const calculateDateDifference = (importantDates: IDates, section: string) => {
  const tagSectionMap: Record<string, string> = {
    result: "result_announcement_date",
    latest_job: "application_start_date",
    answer_key: "answer_key_release_date",
    syllabus: "application_start_date",
    certificate_verification: "certificate_verification_date",
    admission: "counseling_start_date",
    important: "important_date",
    admit_card: "admit_card_release_date",
  };

  const tagKey = tagSectionMap[section] as keyof IDates;
  const dateString = importantDates?.[tagKey] as {
    current_year?: string;
    previous_year?: string;
  };

  const resultDateString =
    dateString?.current_year || dateString?.previous_year;

  if (!resultDateString) {
    return null;
  }

  const currentDate = moment();
  const resultDate = moment(resultDateString);
  resultDate.year(currentDate.year());

  // Calculate the difference in days for the same year
  let daysDifference = resultDate.diff(currentDate, "days");
  // Handle year wrap-around cases (e.g., Dec -> Jan or Jan -> Dec)
  if (daysDifference < -183) {
    // If resultDate is far in the past, assume it's in the next year
    daysDifference = resultDate.add(1, "year").diff(currentDate, "days");
  } else if (daysDifference > 183) {
    // If resultDate is far in the future, assume it's in the previous year
    daysDifference = resultDate.subtract(1, "year").diff(resultDate, "days");
  }

  return daysDifference;
};

const tag = (section: string, importantDates?: IDates) => {
  if (!importantDates) return "";
  const days = calculateDateDifference(importantDates, section);
  if (days === null) return "";

  // Find the matching tag based on the number of days
  const matchingTag = TAGS.find(
    (tag) =>
      tag.daysRange && days >= tag.daysRange[0] && days <= tag.daysRange[1]
  );

  // Return the styled tag if a label is assigned
  return matchingTag ? `pl-2 border-l-2 border-${matchingTag?.color}` : "";
};

export default tag;
