import React, { useState } from "react";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import { removeKeyValuePair, setKeyValuePair } from "shared/store/post-slice";
import RenderField from "post/components/postDetails/RenderField";
import { EditableField } from "./PostDetailsUtils";

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
