import moment from "moment";

export const renderDateStrNum = (value: any, key?: string) => {
  if (!value) return "N/A";

  if (value && typeof value === "string" && value.startsWith("https://")) {
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-custom-red underline whitespace-nowrap font-semibold hover:text-custom-blue"
      >
        Click here
      </a>
    );
  }

  if (value && typeof value === "string" && value.includes("//")) {
    return (
      <p>
        {value.split("//").map((part, index) => (
          <span key={index}>
            {part}
            {index !== value.split("//").length - 1 && <br />}
          </span>
        ))}
      </p>
    );
  }

  if (value && typeof value === "string") {
    // Check if value is a valid ISO date
    const isoDate = moment(value, moment.ISO_8601, true).isValid();

    if (isoDate) {
      return <>{moment(value).format("Do MMMM YYYY")}</>;
    }

    // Return the string as-is if not an ISO date
    return <>{value}</>;
  }

  return value.toString();
};
