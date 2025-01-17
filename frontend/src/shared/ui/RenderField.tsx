import { Link } from "react-router-dom";
import RenderDate from "./RenderDate";
import _ from "lodash";

const RenderField = ({
  stringValue,
  uniqueKey,
  linkClassProp
}: {
  stringValue: string;
  uniqueKey: string;  
  linkClassProp?:string;
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
        className={`underline ${linkClassProp}`}
      >
        Click here
      </a>
    );
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
