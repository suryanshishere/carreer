import React from "react";
import { IDates } from "models/postModels/overallInterfaces/IDates";
import moment from "moment";

const calculateDateDifference = (importantDates: IDates, section: string) => {
  const tagSectionMap: Record<string, string> = {
    result: "result_announcement_date",
    latest_job: "application_start_date",
    /////////////////////////////////////////////
  };

  const tagKey = tagSectionMap[section] as keyof IDates;
  const dateString = importantDates?.[tagKey] as {
    current_year?: string;
    previous_year?: string;
  };
  const resultDateString =
    dateString?.current_year || dateString?.previous_year;

  if (!resultDateString) {
    return 0;
  }

  const currentDate = moment();
  const resultDate = moment(resultDateString);
  console.log(tagKey);
  resultDate.year(currentDate.year());

  // Calculate the difference in days for the same year
  let daysDifference = resultDate.diff(currentDate, "days");
  // // Handle year wrap-around cases (e.g., Dec -> Jan or Jan -> Dec)
  if (daysDifference < -183) {
    // If resultDate is far in the past, assume it's in the next year
    daysDifference = resultDate.add(1, "year").diff(currentDate, "days");
  } else if (daysDifference > 183) {
    // If resultDate is far in the future, assume it's in the previous year
    daysDifference = resultDate.subtract(1, "year").diff(resultDate, "days");
  }

  // console.log(daysDifference,resultDate)
  return daysDifference;
};

const Tag = (importantDates: IDates, section: string) => {
  const days = calculateDateDifference(importantDates, section);
  console.log(days);
  const isReleased = days <= -4;
  const isEarly = days > 25;
  const isLive = days > -3 && days < 2;

  if (isReleased)
    return (
      <mark className="text-xs px-2 bg-custom-super-less-gray rounded-full">
        RELEASED
      </mark>
    );
  if (isEarly)
    return (
      <mark className="text-xs px-2 bg-custom-pale-orange rounded-full">
        EARLY
      </mark>
    );
  if (isLive)
    return (
      <mark className="text-xs px-2 text-custom-white bg-custom-green rounded-full">
        LIVE
      </mark>
    );

  return null;
};

export default Tag;
