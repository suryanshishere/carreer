import React, { useState } from "react";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import { removeKeyValuePair, setKeyValuePair } from "shared/store/post-slice";
import RenderField from "shared/ui/RenderField";

// Define the props type for RenderPostDetail component
interface RenderPostDetailProps {
  value: Date | string | number;
  key: string;
}

const RenderPostDetail: React.FC<RenderPostDetailProps> = ({ value, key }) => {
  const { isEditPostClicked } = useSelector((state: RootState) => state.post);
  const dispatch = useDispatch<AppDispatch>();

  // State management for handling input value, edit status, and save status
  const [inputValue, setInputValue] = useState<string>(
    typeof value === "object" && value instanceof Date ? value.toISOString() : _.toString(value)
  );
  const [isChanged, setIsChanged] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Handle input field change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInputValue(e.target.value);
    setIsChanged(true);
    setIsSaved(false);
  };

  // Handle save button click
  const handleSave = () => {
    dispatch(setKeyValuePair({ key, value: inputValue }));
    setIsChanged(false);
    setIsSaved(true);
  };

  // Handle undo button click
  const handleUndo = () => {
    dispatch(removeKeyValuePair(key));
    setInputValue(
      typeof value === "object" && value instanceof Date ? value.toISOString() : _.toString(value)
    );
    setIsChanged(false);
    setIsSaved(false);
  };

  // If edit mode is active, show editable field
  if (isEditPostClicked) {
    return (
      <EditableField
        value={inputValue}
        onChange={handleInputChange}
        onSave={handleSave}
        onUndo={handleUndo}
        isChanged={isChanged}
        isSaved={isSaved}
      />
    );
  }

  // If not in edit mode, render the field with possible formatting or linking
  const stringValue = _.toString(value);
  return <RenderField stringValue={stringValue} uniqueKey={key} />;
};

// EditableField component for handling input changes, save, and undo
interface EditableFieldProps {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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

export default RenderPostDetail;
