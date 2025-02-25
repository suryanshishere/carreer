import { POST_LIMITS_DB } from "db/post-db";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "shared/store";
import { removeKeyValuePair, setKeyValuePair } from "shared/store/post-slice";
import Button from "shared/utils/form/Button";
import Dropdown from "shared/utils/form/Dropdown";
import { Input, TextArea } from "shared/utils/form/Input";
import { getFieldValidation, validateFieldValue } from "./post_editable_utils";
import { IContribute } from "post/post_interfaces";

const PostEditable: React.FC<IContribute> = ({ keyProp, valueProp }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [inputValue, setInputValue] = useState<Date | string | number>(
    valueProp instanceof Date ? valueProp.toISOString().slice(0, 10) : valueProp
  );
  const [isChanged, setIsChanged] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const lastName = keyProp.split(".").pop() || "";
  const validationConfig = getFieldValidation(lastName);
  // Validation (updated to handle string dates)
  const { isValid, error } = validateFieldValue(
    inputValue instanceof Date ? inputValue.toISOString() : inputValue,
    validationConfig
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const newValue =
      typeof valueProp === "number" ? +e.target.value : e.target.value;
    setInputValue(newValue);
    setIsChanged(true);
    setIsSaved(false);
  };

  const handleSave = () => {
    const parsedValue =
      typeof valueProp === "number"
        ? +inputValue
        : typeof valueProp === "string"
        ? inputValue.toString()
        : new Date(inputValue as string);

    dispatch(setKeyValuePair({ key: keyProp, value: parsedValue }));
    setIsChanged(false);
    setIsSaved(true);
  };

  const handleUndo = () => {
    setInputValue(
      valueProp instanceof Date ? valueProp.toISOString() : valueProp
    );
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
    const inputType =
      typeof valueProp === "number"
        ? "number"
        : validationConfig?.type === "date"
        ? "date"
        : "text";

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
        value={inputValue as string | number}
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
