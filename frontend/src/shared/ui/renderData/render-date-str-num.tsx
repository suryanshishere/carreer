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

  if (typeof value !== "number") {
    return moment(value).isValid()
      ? moment(value).format("Do MMMM YYYY")
      : value.toString();
  }

  return value.toString();
};
