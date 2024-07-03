import React from "react";
import { ObjectItem } from "src/models/exam/DetailProps";

interface HelperProps {
  objectItem:  ObjectItem;
}

export const ValueHandler: React.FC<HelperProps> = ({ objectItem }) => {
  return (
    <>
      {Array.isArray(objectItem.value) ? (
        <span>
          {objectItem.value
            .filter(
              (val): val is string | number =>
                typeof val === "string" || typeof val === "number"
            )
            .map((item, index) =>
              typeof item === "string" &&
              (item.startsWith("http://") || item.startsWith("https://")) ? (
                <a
                  key={index}
                  href={item}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--color-blue)" }}
                >
                  Click here
                </a>
              ) : (
                <span key={index}>
                  {index > 0 && ", "}
                  {item}
                </span>
              )
            )}
        </span>
      ) : (
        <span>{objectItem.value}</span>
      )}
    </>
  );
};
