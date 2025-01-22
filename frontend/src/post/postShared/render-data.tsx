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
    return <RenderArrayTable value={value} arrTableKey={key} />;
  }

  // If the key is in tableRequired and the value is an object, render object table
  if (tableRequired.includes(key) && value && typeof value === "object") {
    return renderTable(value, key);
  }

  // For objects, render the object component
  if (value && typeof value === "object") {
    return renderObject(value, key);
  }

  // Default case: Render the date or number directly
  return <RenderPostDetail value={value} keyProp={key} />;
};

export default renderData;
