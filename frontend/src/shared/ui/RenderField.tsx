import { Link } from "react-router-dom";
import RenderDate from "./RenderDate";
import _ from "lodash";

const RenderField = ({
  stringValue,
  uniqueKey,
  noLinkClassProp,
}: {
  stringValue: string;
  uniqueKey: string;
  noLinkClassProp?: boolean;
}) => {
  if (stringValue === stringValue.toUpperCase() && stringValue.includes("_")) {
    return <Link to={stringValue}>{_.startCase(_.toLower(stringValue))}</Link>;
  }

  if (stringValue.startsWith("https://")) {
    return (
      <a
        href={stringValue}
        target="_blank"
        rel="noopener noreferrer"
        className={noLinkClassProp ? "underline underline-offset-2 decoration-1" : "custom-external-link"}
      >
        Click here
      </a>
    );
  }

  const linkRegex = /\[https?:\/\/[^\]]+\]\((https?:\/\/[^\)]+)\)/g;

  if (linkRegex.test(stringValue)) {
    // Regex to find markdown-style links
    const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;

    const parts = [];
    let lastIndex = 0;

    stringValue.replace(linkRegex, (match, linkText, url, offset) => {
      if (offset > lastIndex) {
        parts.push(stringValue.slice(lastIndex, offset));
      }

      parts.push(
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
          key={url}
        >
          Click Here
        </a>
      );

      lastIndex = offset + match.length;

      return match;
    });

    if (lastIndex < stringValue.length) {
      parts.push(stringValue.slice(lastIndex));
    }

    return <>{parts}</>;
  }

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

  if (stringValue.includes("_")) {
    return <>{_.startCase(stringValue)}</>;
  }

  return <RenderDate stringValue={stringValue} uniqueKey={uniqueKey} />;
};

export default RenderField;
