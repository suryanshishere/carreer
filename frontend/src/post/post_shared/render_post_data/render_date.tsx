import moment from "moment";

interface IRenderDate {
  stringValue: string;
  uniqueKey: string; // Renamed from `key` to avoid conflict
}

export const formatDate = (
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

  if (extractedYear === currentYear) {
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

const RenderDate: React.FC<IRenderDate> = ({ stringValue, uniqueKey }) => {
  const partialDateRegex = /\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(.\d+)?Z)?/; // Match full ISO or just YYYY-MM-DD

  if (!partialDateRegex.test(stringValue)) {
    return <>{stringValue}</>; // Return original string if no match
  }

  // Extract date substring
  const match = partialDateRegex.exec(stringValue);
  if (!match) return <>{stringValue}</>;

  const extractedDate = match[0];

  const { displayDate } = formatDate(stringValue);
  // Replace the matched date in the string with the formatted date
  const updatedString = displayDate
    ? stringValue.replace(extractedDate, displayDate)
    : stringValue;
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
