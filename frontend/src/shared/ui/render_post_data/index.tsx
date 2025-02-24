import { tableRequired } from "../../../post/components/post_detail/postDetailsUtils/post-detail-render-define";
import RenderPostDetail from "../../../post/components/post_detail/postDetailsUtils/RenderPostDetail";
import renderObject from "./render_object";
import RenderTable from "./render_table";
import RenderObject from "./render_object";

const renderStrategies = {
  isNullOrUndefined: (value: any) => value === null || value === undefined,
  isArrayOrObjectWithTable: (key: string, value: any) =>
    (Array.isArray(value) &&
      value.length > 0 &&
      typeof value[0] === "object") ||
    (typeof value === "object" && tableRequired.includes(key)),
  isPlainObject: (value: any) => typeof value === "object",
};

const renderPostData = (key: string, value: any) => {
  if (renderStrategies.isNullOrUndefined(value)) return null;

  if (renderStrategies.isArrayOrObjectWithTable(key, value))
    return <RenderTable value={value} tableKey={key} />;

  if (renderStrategies.isPlainObject(value)) {
    if (value?.current_year || value?.previous_year) {
      const yearData = value.current_year || value.previous_year;
      return <RenderPostDetail value={yearData} keyProp={key} />;
    }

    return <RenderObject value={value} parentKey={key} />;
  }

  return <RenderPostDetail value={value} keyProp={key} />;
};

export default renderPostData;
