import moment from "moment";

export const renderDateStrNum = (value: any, key: string) => {
  if (value && typeof value === "string" && value.startsWith("https://")) {
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline font-bold"
      >
        Click here
      </a>
    );
  }

  if (typeof value === "string" && value.includes("//")) {
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

  if (typeof value === "string") {
    // Check if value is a valid ISO date
    const isoDate = moment(value, moment.ISO_8601, true).isValid();

    if (isoDate) {
      return <p>{moment(value).format("Do MMMM YYYY")}</p>;
    }

    // Return the string as-is if not an ISO date
    return <p>{value}</p>;
  }

  if (typeof value !== "number") {
    return <p>{value.toString()}</p>;
  }

  return <p>{value}</p>;
};
