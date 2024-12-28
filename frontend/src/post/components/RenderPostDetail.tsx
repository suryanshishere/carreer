import React, { useState } from "react";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import { removeKeyValuePair, setKeyValuePair } from "shared/store/post-slice";
import RenderField from "shared/ui/RenderField";

// Define the props type for RenderPostDetail component
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

  const [inputValue, setInputValue] = useState<string>(
    value
      ? typeof value === "object" && value instanceof Date
        ? value.toISOString()
        : _.toString(value)
      : "" // Default empty string
  );
  const [isChanged, setIsChanged] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInputValue(e.target.value);
    setIsChanged(true);
    setIsSaved(false);
  };

  const handleSave = () => {
    dispatch(setKeyValuePair({ key: keyProp, value: inputValue })); // Use `keyProp`
    setIsChanged(false);
    setIsSaved(true);
  };

  const handleUndo = () => {
    dispatch(removeKeyValuePair(keyProp)); // Use `keyProp`
    setInputValue(
      value
        ? typeof value === "object" && value instanceof Date
          ? value.toISOString()
          : _.toString(value)
        : ""
    );
    setIsChanged(false);
    setIsSaved(false);
  };

  // Render logic remains unchanged
  return isEditPostClicked ? (
    <EditableField
      value={inputValue}
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

// EditableField component for handling input changes, save, and undo
interface EditableFieldProps {
  value: string | number;
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
  onChange,
  onSave,
  onUndo,
  isChanged,
  isSaved,
}) => {
  // Check if the input text is long enough to render as a textarea
  const isLongText = typeof value === "string" && value.length > 75;

  return (
    <div>
      {isLongText ? (
        <textarea
          value={value}
          className="outline outline-1 outline-custom-less-gray"
          onChange={onChange}
        />
      ) : (
        <input
          type="text"
          value={value}
          className="outline outline-1 outline-custom-less-gray min-w-fit"
          onChange={onChange}
        />
      )}

      {isChanged && (
        <button
          onClick={onSave}
          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
        >
          Save
        </button>
      )}
      {isSaved && (
        <button
          onClick={onUndo}
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2"
        >
          Undo
        </button>
      )}
    </div>
  );
};
