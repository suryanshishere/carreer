import moment from "moment";

interface IRenderDate {
  stringValue: string;
  uniqueKey: string; // Renamed from `key` to avoid conflict
}

const RenderDate: React.FC<IRenderDate> = ({ stringValue, uniqueKey }) => {
  const partialDateRegex = /\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(.\d+)?Z)?/; // Match full ISO or just YYYY-MM-DD

  if (!partialDateRegex.test(stringValue)) {
    return <>{stringValue}</>; // Return original string if no match
  }

  // Extract date substring
  const match = partialDateRegex.exec(stringValue);
  if (!match) return <>{stringValue}</>;

  const extractedDate = match[0];
  const dateMoment = moment(extractedDate);
  const currentDate = moment();
  const currentYear = currentDate.year();
  const extractedYear = dateMoment.year();
  const monthDifference = dateMoment.diff(currentDate, "months", true);

  let formattedDate: string = "";
  const dateRender = dateMoment.format("Do MMMM YYYY");
  const dateMonth = dateMoment.format("MMMM");
  const nextYear = currentDate.clone().add(1, "years").year();
  const previousYear = currentDate.clone().add(-1, "years").year();
  // Adjust the extracted date's year to the current year to compare the month difference
  const adjustedDate = dateMoment.clone().year(currentYear);
  const adjustedMonthDiff = adjustedDate.diff(currentDate, "months", true);

  if (extractedYear === currentYear) {
    formattedDate = dateRender;
  } else if (extractedYear > currentYear) {
    // For a future year, check if the current month is not December
    if (currentDate.month() !== 11) {
      if (adjustedMonthDiff < 0) {
        formattedDate = `${dateMonth}, ${currentYear}`;
      } else {
        formattedDate = `${dateMonth}, ${currentYear} (Estimated)`;
      }
    } else if (monthDifference > 0) {
      formattedDate = `${dateMonth}, ${nextYear} (Estimated)`;
    } else {
      formattedDate = `${dateMonth}, ${currentYear} (Estimated)`;
    }
  } else {
    // For a past year, check if the current month is not January
    if (currentDate.month() !== 0) {
      if (adjustedMonthDiff > 0 && adjustedMonthDiff < 1) {
        formattedDate = `Coming ${dateMonth}, ${currentYear}`;
      } else if (adjustedMonthDiff < 0) {
        formattedDate = `${dateMonth}, ${currentYear}`;
      } else {
        formattedDate = `This ${dateMonth}, ${currentYear}`;
      }
    } else if (monthDifference < 0) {
      formattedDate = `${dateMonth}, ${previousYear}`;
    } else {
      // Fallback if none of the conditions match
      formattedDate = `This ${dateMonth}, ${currentYear}`;
    }
  }

  // Replace the matched date in the string with the formatted date
  const updatedString = stringValue.replace(extractedDate, formattedDate);
  return <>{updatedString}</>;
};

export default RenderDate;


//old logic
// if (extractedYear >= currentYear) {
//   if (monthDifference > 0 || monthDifference < -2) {
//     formattedDate = `${dateMoment.format("Do MMMM")} ${nextYear} (Estimated)`;
//   } else if (extractedYear > currentYear || dateMoment.isAfter(currentDate)) {
//     formattedDate = `${dateRender} (Estimated)`;
//   } else {
//     formattedDate = dateRender;
//   }
// } else {
//   dateMoment.year(currentYear);
//   const updatedMonthDifference = dateMoment.diff(currentDate, "months");

//   if (updatedMonthDifference > 0 || updatedMonthDifference < -1) {
//     formattedDate = `This ${dateMoment.format(
//       "MMMM"
//     )} ${nextYear} (Estimated)`;
//   } else {
//     formattedDate = `${dateMoment.format("MMMM")}, ${currentYear}`;
//   }
// }
