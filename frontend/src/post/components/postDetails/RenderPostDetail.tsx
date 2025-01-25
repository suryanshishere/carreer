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
  const dispatch = useDispatch<AppDispatch>();

  const [inputValue, setInputValue] = useState<Date | string | number>(
    value instanceof Date ? value.toISOString().slice(0, 10) : value
  );

  const [isChanged, setIsChanged] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const newValue =
    typeof value === "number" ? +e.target.value : e.target.value;
 
    setInputValue(newValue);
    setIsChanged(true);
    setIsSaved(false);
  };

  const handleSave = () => {
    const parsedValue =
      typeof value === "number"
        ? +inputValue
        : typeof value === "string"
        ? inputValue.toString()
        : new Date(inputValue as string);

    dispatch(setKeyValuePair({ key: keyProp, value: parsedValue }));
    setIsChanged(false);
    setIsSaved(true);
  };

  const handleUndo = () => {
    setInputValue(value instanceof Date ? value.toISOString() : value);
    dispatch(removeKeyValuePair(keyProp));
    setIsChanged(false);
    setIsSaved(false);
  };

  // Explicitly map `typeof` to the narrower type
  const valueType: "string" | "number" | "object" =
    typeof value === "string"
      ? "string"
      : typeof value === "number"
      ? "number"
      : "object";

  return isEditPostClicked ? (
    <EditableField
      value={inputValue}
      valueType={valueType}
      onChange={handleInputChange}
      onSave={handleSave}
      onUndo={handleUndo}
      isChanged={isChanged}
      isSaved={isSaved}
      keyProp={keyProp}
    />
  ) : (
    <RenderField stringValue={_.toString(value)} uniqueKey={keyProp} />
  );
};

export default RenderPostDetail;
