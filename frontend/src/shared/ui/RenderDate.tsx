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
  const monthDifference = dateMoment.diff(currentDate, "months");

  let formattedDate;
  const dateRender = dateMoment.format("Do MMMM YYYY");
  const nextYear = currentDate.clone().add(1, "years").year();

 if (extractedYear >= currentYear) {
    if (monthDifference > 0 || monthDifference < -2) {
      formattedDate = `${dateMoment.format("Do MMMM")} ${nextYear} (Estimated)`;
    } else if (extractedYear > currentYear || dateMoment.isAfter(currentDate)) {
      formattedDate = `${dateRender} (Estimated)`;
    } else {
      formattedDate = dateRender;
    }
  } else {
    dateMoment.year(currentYear);
    const updatedMonthDifference = dateMoment.diff(currentDate, "months");

    if (updatedMonthDifference > 0 || updatedMonthDifference < -1) {
      formattedDate = `This ${dateMoment.format(
        "MMMM"
      )} ${nextYear} (Estimated)`;
    } else {
      formattedDate = `${dateMoment.format("MMMM")}, ${currentYear}`;
    }
  }

  // Replace the matched date in the string with the formatted date
  const updatedString = stringValue.replace(extractedDate, formattedDate);
  return <>{updatedString}</>;
};

export default RenderDate;
