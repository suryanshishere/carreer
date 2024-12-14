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
        className={`text-custom-red underline whitespace-nowrap hover:decoration-custom-gray ${!key && "font-semibold"}`}
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

  // Check if value is a valid ISO date
  const partialDateRegex = /\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(.\d+)?Z)?/; // Match full ISO or just YYYY-MM-DD
  if (partialDateRegex.test(stringValue)) {
    // Extract date substring
    const match = partialDateRegex.exec(stringValue);
    if (match) {
      const extractedDate = match[0];
      const formattedDate = moment(extractedDate).format("Do MMMM YYYY");
      // Replace the matched date in the string with the formatted date
      const updatedString = stringValue.replace(
        extractedDate,
        formattedDate
      );
      return <>{updatedString}</>;
    }
  }

  // Return the string as-is for other cases
  return <>{stringValue}</>;
};
