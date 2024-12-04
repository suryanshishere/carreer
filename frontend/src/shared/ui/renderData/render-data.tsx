import {  tableRequired } from "post/components/DetailItem";
import { renderTable } from "./render-table";
import { renderObject } from "./render-object";
import { renderArrayTable } from "./render-array-table";
import { renderDateStrNum } from "./render-date-str-num";

export const renderValue = (value: any, key: string) => {
  if (
    Array.isArray(value) &&
    value.length > 0 &&
    typeof value[0] === "object"
  ) {
    return renderArrayTable(value, key);
  }

  if (tableRequired.includes(key) && value && typeof value === "object") {
    return renderTable(value, key);
  }

  if (value && typeof value === "object") {
    return renderObject(value, key);
  }

  if (value && (typeof value === "number" || typeof value === "string")) {
    return renderDateStrNum(value, key);
  }

  return null;
};
