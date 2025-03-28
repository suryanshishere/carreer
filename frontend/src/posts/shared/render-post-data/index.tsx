import { collapsible, TABLE_REQUIRED } from "posts/db/renders";
import RenderTable from "./RenderTable";
import RenderObject from "./RenderObject";
import RenderField from "posts/shared/render-post-data/RenderField";
import PostEditableList from "../post-editable/PostEditableList";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import { useLocation } from "react-router-dom";

const renderStrategies = {
  isNullOrUndefined: (value: any) => value === null || value === undefined,
  isArrayOrObjectWithTable: (keyProp: string, value: any) =>
    (Array.isArray(value) &&
      value.length > 0 &&
      typeof value[0] === "object") ||
    (typeof value === "object" && TABLE_REQUIRED[keyProp]),
  isPlainObject: (value: any) => typeof value === "object",
};

type RenderPostDataProps = {
  keyProp: string;
  valueProp: any;
  isPostEditable?:boolean
};

const RenderPostData: React.FC<RenderPostDataProps> = ({
  keyProp,
  valueProp,
  isPostEditable=true
}) => {
  const { isEditPostClicked } = useSelector((state: RootState) => state.post);
  const location = useLocation();
  const urlPath = location.pathname;

  if (renderStrategies.isNullOrUndefined(valueProp)) return null;

  if (renderStrategies.isArrayOrObjectWithTable(keyProp, valueProp))
    return (
      <>
        <RenderTable
          value={valueProp}
          tableKey={keyProp}
          isCollapsible={collapsible[keyProp]}
        />
        {isEditPostClicked && isPostEditable&& /^\/sections\/[^/]+\/[^/]+/.test(urlPath) && (
          <PostEditableList
            initialItems={[{ id: Date.now(), keyProp, valueProp }]}
          />
        )}
      </>
    );

  if (renderStrategies.isPlainObject(valueProp)) {
    if (valueProp?.current_year || valueProp?.previous_year) {
      const yearData = valueProp.current_year || valueProp.previous_year;
      return (
        <RenderField
          valueProp={yearData}
          uniqueKey={`${keyProp}.current_year`}
        />
      );
    }
    return <RenderObject value={valueProp} parentKey={keyProp} />;
  }
  return <RenderField valueProp={valueProp} uniqueKey={keyProp} isPostEditable={isPostEditable}/>;
};

export default RenderPostData;
