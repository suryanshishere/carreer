import React, { useState } from "react";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import { removeKeyValuePair, setKeyValuePair } from "shared/store/post-slice";
import RenderField from "shared/ui/RenderField";
import Button from "shared/utils/form/Button";

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    />
  ) : (
    <RenderField stringValue={_.toString(value)} uniqueKey={keyProp} />
  );
};

export default RenderPostDetail;

interface EditableFieldProps {
  value: Date | string | number;
  valueType: "string" | "number" | "object"; // Type of the value
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSave: () => void;
  onUndo: () => void;
  isChanged: boolean;
  isSaved: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({
  value,
  valueType,
  onChange,
  onSave,
  onUndo,
  isChanged,
  isSaved,
}) => {
  const isLongText = valueType === "string" && (value as string).length > 75;

  return (
    <div className="flex flex-col gap-2">
      {isLongText ? (
        <textarea
          value={value as string}
          className="outline outline-1 outline-custom-less-gray w-full  pl-2 py-1"
          onChange={onChange}
        />
      ) : (
        <input
          type={
            valueType === "number"
              ? "number"
              : valueType === "object"
              ? "date"
              : "text"
          }
          value={value as string | number}
          className="outline outline-1 outline-custom-less-gray w-full pl-2 py-1"
          onChange={onChange}
        />
      )}
      {isChanged && (
        <button
          onClick={onSave}
          className="bg-custom-blue text-white px-2 py-1 rounded hover:bg-custom-dark-blue transform ease-linear duration-200"
        >
          Save
        </button>
      )}
      {isSaved && <Button onClick={onUndo} classProp="py-1 bg-custom-white transform ease-linear duration-200">Undo</Button>}
    </div>
  );
};
