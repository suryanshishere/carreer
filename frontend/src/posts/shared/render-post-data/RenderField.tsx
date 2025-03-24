import { Link, useLocation } from "react-router-dom";
import RenderDate from "./RenderDate";
import _, { startCase } from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import PostEditable from "../post-editable";
import { POST_LIMIT_DROPDOWN_DATA } from "posts/db";
import { renamingData } from "posts/db/renders";

const RenderField = ({
  valueProp,
  uniqueKey,
  noLinkClassProp,
}: {
  valueProp: any;
  uniqueKey: string;
  noLinkClassProp?: boolean;
}) => {
  const { isEditPostClicked } = useSelector((state: RootState) => state.post);
  const location = useLocation();
  const urlPath = location.pathname;
  //if editpostclicked is true, then render editable post (other factor can be added to more precise)
  if (isEditPostClicked && /^\/sections\/[^/]+\/[^/]+/.test(urlPath)) {
    if (uniqueKey === "last_updated")
      return (
        <span className="text-custom_less_gray">Can't be contributed.</span>
      );
    return <PostEditable valueProp={valueProp} keyProp={uniqueKey} />;
  }

  let strValue: string = _.toString(valueProp);
  const lastKey: string = uniqueKey?.split(".").pop() || uniqueKey;

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

  //links formating
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

    if (lastIndex < valueProp.length) {
      parts.push(valueProp.slice(lastIndex));
    }

    return <>{parts}</>;
  }

  //into points formating the paragraph
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

  //date check
  const partialDateRegex = /\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(.\d+)?Z)?/;
  if (partialDateRegex.test(strValue)) {
    const match = partialDateRegex.exec(strValue);
    if (!match) return <>{strValue}</>;

    return <RenderDate strValue={strValue} uniqueKey={uniqueKey} />;
  }

  //adding extra renders to it.
  if (POST_LIMIT_DROPDOWN_DATA.has(strValue)) {
    const keyValues = renamingData[lastKey] as {
      [key: string]: string;
    };

    if (keyValues && strValue in keyValues && keyValues[strValue]) {
      return <>{keyValues[strValue]}</>;
    }

    return <>{startCase(strValue)}</>;
  }

  const uniValue = renamingData[uniqueKey];
  if (typeof uniValue === "string") {
    return <>{strValue + " " + uniValue}</>;
  }

  //for post code and version link checks
  if (strValue === strValue.toLowerCase() && strValue.includes("_")) {
    const [postCode, version = "main"] = strValue.split("_1_");
    return (
      <Link to={`${postCode}/${version}`} className="custom_link">
        {startCase(postCode) + " (" + startCase(version) + ")"}
      </Link>
    );
  }

  if (strValue.includes("_")) {
    return <>{startCase(strValue)}</>;
  }

  return <> {strValue}</>;
};

export default RenderField;
