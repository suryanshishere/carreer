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

  if (typeof value !== "number") {
    return (
      <p>
        {moment(value).isValid()
          ? moment(value).format("Do MMMM YYYY")
          : value.toString()}
      </p>
    );
  }

  return <p>{value.toString()}</p>;
};
