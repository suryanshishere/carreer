import { Link } from "react-router-dom";
import RenderDate from "./RenderDate";
import _ from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import PostEditable from "../post-editable";
import { POST_LIMIT_DROPDOWN_DATA } from "post/post-db";

const RenderField = ({
  stringValue,
  uniqueKey,
  noLinkClassProp,
}: {
  stringValue: any;
  uniqueKey: string;
  noLinkClassProp?: boolean;
}) => {
  const { isEditPostClicked } = useSelector((state: RootState) => state.post);
  //if editpostclicked is true, then render editable post (other factor can be added to more precise)
  if (isEditPostClicked) {
    return <PostEditable valueProp={stringValue} keyProp={uniqueKey} />;
  }

  let strValue = _.toString(stringValue);

  // TODO: ADD more meta data for the str value key word here.
  if (POST_LIMIT_DROPDOWN_DATA.has(strValue)) {
    return <>{_.startCase(strValue.replace(/_/g, " "))}</>;
  }

  if (strValue.startsWith("https://")) {
    return (
      <a
        href={strValue}
        target="_blank"
        rel="noopener noreferrer"
        className={
          noLinkClassProp
            ? "underline underline-offset-2 decoration-1"
            : "custom-external-link"
        }
      >
        Click here
      </a>
    );
  }

  const linkRegex = /\[https?:\/\/[^\]]+\]\((https?:\/\/[^\)]+)\)/g;

  if (linkRegex.test(strValue)) {
    // Regex to find markdown-style links
    const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;

    const parts = [];
    let lastIndex = 0;

    strValue.replace(linkRegex, (match, linkText, url, offset) => {
      if (offset > lastIndex) {
        parts.push(strValue.slice(lastIndex, offset));
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

  if (
    strValue.includes("//") ||
    strValue.includes("\n") ||
    strValue.match(/(\.\s\d\.)/)
  ) {
    return (
      <p>
        {strValue
          .split(/\/\/|\n|(?=\d\.)/) // Split before digits followed by a period
          .filter((part) => part.trim() !== "") // Remove empty or whitespace-only parts
          .map((part, index) => (
            <span key={index}>
              {part.trim()} {/* Trim extra spaces */}
              {index !== strValue.split(/\/\/|\n|(?=\d\.)/).length - 1 && (
                <br />
              )}
            </span>
          ))}
      </p>
    );
  }

  if (strValue === strValue.toLowerCase() && strValue.includes("_")) {
    return (
      <Link to={strValue} className="custom-link">
        {_.startCase(strValue)}
      </Link>
    );
  }

  if (strValue.includes("_")) {
    return <>{_.startCase(strValue)}</>;
  }

  //date check
  const partialDateRegex = /\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(.\d+)?Z)?/;
  if (partialDateRegex.test(strValue)) {
    const match = partialDateRegex.exec(strValue);
    if (!match) return <>{strValue}</>;

    return <RenderDate stringValue={strValue} uniqueKey={uniqueKey} />;
  }

  return <> {strValue}</>;
};

export default RenderField;
