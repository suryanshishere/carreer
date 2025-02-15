import React from "react";
import _ from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import RenderField from "post/postShared/RenderField";
import EditableField from "./PostDetailsEditable";

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
    <EditableField value={value} keyProp={keyProp} />
  ) : (
    <RenderField stringValue={_.toString(value)} uniqueKey={keyProp} />
  );
};

export default RenderPostDetail;
