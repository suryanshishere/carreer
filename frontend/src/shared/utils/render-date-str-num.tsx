import React, { useState } from "react";
import moment from "moment";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import { removeKeyValuePair, setKeyValuePair } from "shared/store/post-slice";

const RenderDateStrNum = (value: Date | string | number, key: string) => {
  const { isEditPostClicked, keyValuePairs } = useSelector(
    (state: RootState) => state.post
  );

  const dispatch = useDispatch<AppDispatch>();

  const [inputValue, setInputValue] = useState(
    typeof value === "object" && value instanceof Date
      ? value.toISOString()
      : value
  );

  const [isChanged, setIsChanged] = useState(false);
  const [isSaved, setIsSaved] = useState(false); // Tracks if the value has been saved

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInputValue(e.target.value);
    setIsChanged(true);
    setIsSaved(false); // Reset the saved state when input changes
  };

  const handleSave = () => {
    dispatch(setKeyValuePair({ key, value: inputValue }));
    setIsChanged(false);
    setIsSaved(true); // Mark as saved
  };

  const handleUndo = () => {
    dispatch(removeKeyValuePair(key));
    setInputValue(
      typeof value === "object" && value instanceof Date
        ? value.toISOString()
        : value
    ); // Reset the input value to the original
    setIsChanged(false); // Reset state
    setIsSaved(false); // Hide the Undo button
  };

  if (isEditPostClicked) {
    const isLongText = typeof inputValue === "string" && inputValue.length > 75;

    return (
      <>
        {isLongText ? (
          <textarea
            value={inputValue}
            name={key}
            className="outline outline-1 outline-custom-less-gray"
            onChange={handleInputChange}
          />
        ) : (
          <input
            type={typeof value}
            value={inputValue}
            name={key}
            className="outline outline-1 outline-custom-less-gray min-w-fit"
            onChange={handleInputChange}
          />
        )}
        {isChanged && (
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
          >
            Save
          </button>
        )}
        {isSaved && (
          <button
            onClick={handleUndo}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2"
          >
            Undo
          </button>
        )}
      </>
    );
  }

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

export default RenderDateStrNum;
