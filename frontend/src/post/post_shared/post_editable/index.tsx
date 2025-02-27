import { POST_LIMITS_DB } from "post/post_db";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "shared/store";
import { removeKeyValuePair, setKeyValuePair } from "shared/store/post-slice";
import Button from "shared/utils/form/Button";
import Dropdown from "shared/utils/form/Dropdown";
import { Input, TextArea } from "shared/utils/form/Input";
import { getFieldValidation, validateFieldValue } from "./post_editable_utils";
import { IContribute } from "post/post_interfaces";

// Helper to convert a value to an ISO date string
const formatDateValue = (value: any): string => {
  // Ensure we have a valid date
  const date = new Date(value);
  return isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

const PostEditable: React.FC<IContribute> = ({ keyProp, valueProp }) => {
  const dispatch = useDispatch<AppDispatch>();
  const lastName = keyProp.split(".").pop() || "";
  const validationConfig = getFieldValidation(lastName);
console.log(lastName)
  // Determine the input type.
  const inputType =
    typeof valueProp === "number"
      ? "number"
      : validationConfig?.type === "date"
      ? "date"
      : "text";

  // If it's a date, initialize with a properly formatted string
  const initialInputValue =
    inputType === "date" ? formatDateValue(valueProp) : valueProp;

  const [inputValue, setInputValue] = useState<string | number>(initialInputValue);
  const [isChanged, setIsChanged] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Validation (updated to handle string dates)
  const { isValid, error } = validateFieldValue(inputValue, validationConfig);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    let newValue: string | number = e.target.value;
    if (typeof valueProp === "number") {
      newValue = +e.target.value;
    } else if (inputType === "date") {
      // Ensure the date value is in the correct format
      newValue = e.target.value; // Should already be in YYYY-MM-DD format
    }
    setInputValue(newValue);
    setIsChanged(true);
    setIsSaved(false);
  };

  const handleSave = () => {
    // When saving, you might want to convert back if needed.
    // For date inputs, you can keep the ISO date string or convert it to a Date object.
    const parsedValue =
      typeof valueProp === "number"
        ? +inputValue
        : validationConfig?.type === "date"
        ? inputValue.toString() // or: new Date(inputValue.toString())
        : inputValue.toString();

    dispatch(setKeyValuePair({ key: keyProp, value: parsedValue }));
    setIsChanged(false);
    setIsSaved(true);
  };

  const handleUndo = () => {
    setInputValue(initialInputValue);
    dispatch(removeKeyValuePair(keyProp));
    setIsChanged(false);
    setIsSaved(false);
  };

  const renderInputField = () => {
    if (validationConfig?.type === "dropdown") {
      return (
        <Dropdown
          name={keyProp}
          defaultValue={valueProp}
          data={
            POST_LIMITS_DB.dropdown_data[
              lastName as keyof typeof POST_LIMITS_DB.dropdown_data
            ] ?? []
          }
          onChange={handleInputChange}
        />
      );
    }

    const isLongText = typeof valueProp === "string" && valueProp.length > 75;

    if (isLongText) {
      return (
        <TextArea
          name={keyProp}
          value={inputValue as string}
          error={!isValid}
          helperText={error}
          onChange={handleInputChange}
          outerClassProp="h-full"
        />
      );
    }

    return (
      <Input
        name={keyProp}
        type={inputType}
        value={inputValue}
        error={!isValid}
        helperText={error}
        onChange={handleInputChange}
      />
    );
  };

  return (
    <div className="w-full h-full my-1 flex flex-col justify-center gap-2">
      {renderInputField()}

      {isSaved && (
        <Button
          onClick={handleUndo}
          classProp="py-1 bg-custom-white transform ease-linear duration-200"
        >
          Undo
        </Button>
      )}

      {isChanged && (
        <Button
          contributeSaveButton
          onClick={() => {
            if (isValid) handleSave();
          }}
          disabled={!isValid}
          className={`flex-1 px-2 py-1 rounded transform ease-linear duration-200 ${
            isValid
              ? "bg-custom-blue text-custom-white hover:bg-custom-dark-blue"
              : "bg-custom-less-gray text-custom-gray cursor-not-allowed"
          }`}
        >
          Save
        </Button>
      )}
    </div>
  );
};

export default PostEditable;
