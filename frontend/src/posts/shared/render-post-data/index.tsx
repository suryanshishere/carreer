import { collapsible, tableRequired } from "posts/db/renders";
import RenderTable from "./RenderTable";
import RenderObject from "./RenderObject";
import RenderField from "posts/shared/render-post-data/RenderField";

const renderStrategies = {
  isNullOrUndefined: (value: any) => value === null || value === undefined,
  isArrayOrObjectWithTable: (key: string, value: any) =>
    (Array.isArray(value) &&
      value.length > 0 &&
      typeof value[0] === "object") ||
    (typeof value === "object" && tableRequired[key]),
  isPlainObject: (value: any) => typeof value === "object",
};

const renderPostData = (key: string, value: any) => {
  if (renderStrategies.isNullOrUndefined(value)) return null;

  if (renderStrategies.isArrayOrObjectWithTable(key, value))
    return (
      <RenderTable
        value={value}
        tableKey={key}
        isCollapsible={collapsible[key]}
      />
    );

  if (renderStrategies.isPlainObject(value)) {
    if (value?.current_year || value?.previous_year) {
      const yearData = value.current_year || value.previous_year;
      return (
        <RenderField stringValue={yearData} uniqueKey={`${key}.current_year`} />
      );
    }
    return <RenderObject value={value} parentKey={key} />;
  }
  return <RenderField stringValue={value} uniqueKey={key} />;
};

export default renderPostData;
