import { POST_LIMITS_DB } from "posts/db";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "shared/store";
import { removeKeyValuePair, setKeyValuePair } from "shared/store/postSlice";
import Button from "shared/utils/form/Button";
import Dropdown from "shared/utils/form/Dropdown";
import { Input, TextArea } from "shared/utils/form/Input";
import { getFieldValidation, validateFieldValue } from "./post-editable-utils";
import { IContribute } from "posts/db/interfaces";

const formatDateValue = (value: any): string => {
  const date = new Date(value);
  return isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

const PostEditable: React.FC<IContribute> = ({ keyProp, valueProp }) => {
  const dispatch = useDispatch<AppDispatch>();
  const lastName = keyProp.split(".").pop() || "";
  const validationConfig = getFieldValidation(lastName);

  const inputType =
    typeof valueProp === "number"
      ? "number"
      : validationConfig?.type === "date"
      ? "date"
      : "text";

  const initialInputValue =
    inputType === "date" ? formatDateValue(valueProp) : valueProp;

  const [inputValue, setInputValue] = useState<string | number>(initialInputValue);
  const [isChanged, setIsChanged] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(inputType === "date");

  const { isValid, error } = isFirstRender && inputType === "date"
    ? { isValid: true, error: "" }
    : validateFieldValue(inputValue, validationConfig);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    let newValue: string | number = e.target.value;
    if (typeof valueProp === "number") {
      newValue = +e.target.value;
    } else if (inputType === "date") {
      newValue = e.target.value;
    }
    setInputValue(newValue);
    setIsChanged(true);
    setIsSaved(false);
    if (isFirstRender) setIsFirstRender(false);
  };

  const handleSave = () => {
    const parsedValue =
      typeof valueProp === "number"
        ? +inputValue
        : validationConfig?.type === "date"
        ? inputValue.toString()
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
          className="py-2 bg-custom_white transform ease-linear duration-200"
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
          className={`flex-1 px-2 py-2 rounded transform ease-linear duration-200 ${
            isValid
              ? "bg-custom_blue text-custom_white hover:bg-custom_dark_blue"
              : "bg-custom_less_gray text-custom_gray cursor-not-allowed"
          }`}
        >
          Save
        </Button>
      )}
    </div>
  );
};

export default PostEditable;
