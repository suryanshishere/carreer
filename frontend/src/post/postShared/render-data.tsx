import { tableRequired } from "./post-detail-render-define";
import RenderPostDetail from "../components/postDetails/RenderPostDetail";
import RenderArrayTable from "../components/postDetails/RenderArrayTable";
import renderTable from "./render-table";
import renderObject from "./render-object";

const renderData = (value: any, key: string) => {
  // Check if value is an array of objects and render the table for arrays
  if (
    Array.isArray(value) &&
    value.length > 0 &&
    typeof value[0] === "object"
  ) {
    return (
      <div className="mt-3">
        <RenderArrayTable value={value} arrTableKey={key} />
      </div>
    );
  }

  // If the key is in tableRequired and the value is an object, render object table
  if (tableRequired.includes(key) && value && typeof value === "object") {
    return <div className="mt-3">{renderTable(value, key)}</div>;
  }

  // For objects, render the object component
  if (value && typeof value === "object") {
    return <div className="mt-2"> {renderObject(value, key)}</div>;
  }

  // Default case: Render the date or number directly
  return <RenderPostDetail value={value} keyProp={key} />;
};

export default renderData;
