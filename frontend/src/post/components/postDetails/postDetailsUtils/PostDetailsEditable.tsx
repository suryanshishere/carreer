import { POST_LIMITS_ENV_DB } from "db/post-env-db";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "shared/store";
import { removeKeyValuePair, setKeyValuePair } from "shared/store/post-slice";
import Button from "shared/utils/form/Button";
import Dropdown from "shared/utils/form/Dropdown";
import { Input, TextArea } from "shared/utils/form/Input";
import { getFieldValidation, validateFieldValue } from "./editable-validation";


interface IPostDetailsEditable {
  value: Date | string | number;
  keyProp: string;
}

const PostDetailsEditable: React.FC<IPostDetailsEditable> = ({
  value,
  keyProp,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [inputValue, setInputValue] = useState<Date | string | number>(
    value instanceof Date ? value.toISOString().slice(0, 10) : value
  );
  const [isChanged, setIsChanged] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const lastName = keyProp.split(".").pop() || "";
  const validationConfig = getFieldValidation(lastName);
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

  const renderInputField = () => {
    if (validationConfig?.type === "dropdown") {
      return (
        <Dropdown
          name={keyProp}
          defaultValue={value}
          data={(POST_LIMITS_ENV_DB as any)[lastName] ?? []}
          onChange={handleInputChange}
        />
      );
    }

    const isLongText = typeof value === "string" && value.length > 75;
    const inputType =
      typeof value === "number"
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
    <div className="w-full h-full flex flex-col justify-center gap-2">
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

export default PostDetailsEditable;
