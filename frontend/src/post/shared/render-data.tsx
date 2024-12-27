import { tableRequired } from "./post-detail-render-define";
import { renderTable } from "./render-table";
import { renderObject } from "./render-object";
import { renderArrayTable } from "./render-array-table";
import  RenderDateStrNum  from "../../shared/utils/render-date-str-num";

export const renderValue = (value: any, key: string) => {
  if (
    Array.isArray(value) &&
    value.length > 0 &&
    typeof value[0] === "object"
  ) {
    return renderArrayTable(value, key);
  }

  if (tableRequired.includes(key) && value && typeof value === "object") {
    return <div className="mt-3 w-full"> {renderTable(value, key)}</div>;
  }

  //manage direct dates rendering, so not need to enter conditional for the renderdatestrnum
  if (value && typeof value === "object") {
    return renderObject(value, key);
  }

  return RenderDateStrNum(value,key);
};