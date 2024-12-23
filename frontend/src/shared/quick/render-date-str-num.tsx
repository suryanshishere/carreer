import moment from "moment";
import _ from "lodash";

export const renderDateStrNum = (value: any, key?: string) => {
  if (value === null || value === undefined) return "N/A";

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
      const dateMoment = moment(extractedDate);
      const currentDate = moment();

      const currentYear = currentDate.year();
      const extractedYear = dateMoment.year();

      const monthDifference = dateMoment.diff(currentDate, "months");

      let formattedDate;
      const dateRender = dateMoment.format("Do MMMM YYYY");
      const nextYear = moment().add(1, "years").year();

      if (!key) {
        formattedDate = dateRender;
      } else if (extractedYear >= currentYear) {
        if (monthDifference > 0 || monthDifference < -2) {
          formattedDate = `${
            dateMoment.format("Do MMMM") + " " + nextYear
          } (Estimated)`;
        } else if (
          extractedYear > currentYear ||
          dateMoment.isAfter(currentDate)
        ) {
          formattedDate = `${dateRender} (Estimated)`;
        } else {
          formattedDate = dateRender;
        }
      } else {
        dateMoment.year(currentYear);
        const monthDifference = dateMoment.diff(currentDate, "months");
        // if (monthDifference === 0) {
        //   formattedDate = `This ${
        //     dateMoment.format("MMMM") + " " + currentDate.year()
        //   } (Estimated)`;
        // } else

        if (monthDifference > 0 || monthDifference < -1) {
          formattedDate = `This ${
            dateMoment.format("MMMM") + " " + nextYear
          } (Estimated)`;
        } else {
          formattedDate = `${dateMoment.format("MMMM")}, ${currentDate.year()}`;
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
