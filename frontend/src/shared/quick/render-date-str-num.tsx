import moment from "moment";
import _ from "lodash";

export const renderDateStrNum = (value: any, key?: string) => {
  if (_.isNil(value)) return "N/A";

  const stringValue = _.toString(value);

  // Handle URLs
  if (stringValue.startsWith("https://")) {
    return (
      <a
        href={stringValue}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-custom-red underline whitespace-nowrap hover:decoration-custom-gray ${
          !key && "font-semibold"
        }`}
      >
        Click here
      </a>
    );
  }

  // Handle strings with `//`
  if (stringValue.includes("//") || stringValue.includes("\n")) {
    return (
      <p>
        {stringValue.split(/\/\/|\n/).map((part, index) => (
          <span key={index}>
            {part}
            {index !== stringValue.split(/\/\/|\n/).length - 1 && <br />}
          </span>
        ))}
      </p>
    );
  }

  // Check for invalid MongoDB ObjectId pattern
  const mongoObjectIdRegex = /^[a-f\d]{24}$/i;
  if (mongoObjectIdRegex.test(stringValue)) {
    return "N/A";
  }

  // Convert snake_case to normal case
  const isSnakeCase = stringValue.includes("_");
  if (isSnakeCase) {
    return <>{_.startCase(_.toLower(stringValue))}</>;
  }

  // current year always)
  const partialDateRegex = /\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(.\d+)?Z)?/; // Match full ISO or just YYYY-MM-DD

if (partialDateRegex.test(stringValue)) {
  // Extract date substring
  const match = partialDateRegex.exec(stringValue);
  if (match) {
    const extractedDate = match[0];

    // Parse the extracted date
    const dateMoment = moment(extractedDate);

    // Get current date
    const currentDate = moment();

    const isFutureDate = dateMoment.isAfter(currentDate, 'day'); // Check if day and month are in future

    let formattedDate;

    if (dateMoment.year() === currentDate.year()) {
      // If the year matches the current year
      if (isFutureDate) {
        // If the date is in the future
        formattedDate = `${dateMoment.format("Do MMMM YYYY")} (Estimated)`;
      } else {
        // Otherwise, format as "Do MMMM YYYY"
        formattedDate = dateMoment.format("Do MMMM YYYY");
      }
    } else {
      // If the year is not the current year
      const isPastDate = dateMoment.isBefore(currentDate, 'day');
      if (isPastDate) {
        // If day and month comparison for future is not true
        const isFutureMonth = dateMoment.month() > currentDate.month() || (dateMoment.month() === currentDate.month() && dateMoment.date() > currentDate.date());
        if (isFutureMonth) {
          // If the date's day and month are in the future
          formattedDate = `This ${dateMoment.format("MMMM")}, ${currentDate.year()} (Estimated)`;
        } else {
          // Otherwise, show just the month of the past year
          formattedDate = `${dateMoment.format("MMMM")}, ${currentDate.year()}`;
        }
      } else {
        // If the date is ahead in the future, show "Estimated"
        formattedDate = `This ${dateMoment.format("MMMM")}, ${currentDate.year()} (Estimated)`;
      }
    }

    // Replace the matched date in the string with the formatted date
    const updatedString = stringValue.replace(extractedDate, formattedDate);
    return <>{updatedString}</>;
  }
}


  // Return the string as-is for other cases
  return <>{stringValue}</>;
};
