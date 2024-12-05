import moment from "moment";

export const renderDateStrNum = (value: any, key?: string) => {
  if (value && typeof value === "string" && value.startsWith("https://")) {
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-custom-red underline font-bold"
      >
        Click here
      </a>
    );
  }

  if (value && typeof value === "string" && value.includes("//")) {
    return (
      <>
        {value.split("//").map((part, index) => (
          <span key={index}>
            {part}
            {index !== value.split("//").length - 1 && <br />}
          </span>
        ))}
      </>
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

  if ( value && typeof value !== "number") {
    return <>{value.toString()}</>;
  }

  return null;
};
