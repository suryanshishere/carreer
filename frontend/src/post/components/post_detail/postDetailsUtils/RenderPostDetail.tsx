import React from "react";
import _ from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import RenderField from "post/post_shared/RenderField";
import EditableField from "../../../post_shared/post_editable";

interface RenderPostDetailProps {
  value: Date | string | number;
  keyProp: string; // Accept as `keyProp`
}

const RenderPostDetail: React.FC<RenderPostDetailProps> = ({
  value,
  keyProp,
}) => {
  const { isEditPostClicked } = useSelector((state: RootState) => state.post);

  return isEditPostClicked ? (
    <EditableField valueProp={value} keyProp={keyProp} />
  ) : (
    <RenderField stringValue={_.toString(value)} uniqueKey={keyProp} />
  );
};

export default RenderPostDetail;
