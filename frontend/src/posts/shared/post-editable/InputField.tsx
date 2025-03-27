import React from "react";
import { POST_LIMITS_DB } from "posts/db";
import { Input, TextArea } from "shared/utils/form/Input";
import Dropdown from "shared/utils/form/Dropdown";
import { IValidationConfig } from "./post-editable-utils";
import useResponsiveView from "shared/hooks/useResponsiveView";

interface InputFieldProps {
  keyProp: string;
  valueProp: string | number;
  inputValue: string | number;
  inputType: string;
  isValid: boolean;
  error?: string;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  validationConfig?: IValidationConfig;
  // lastName is used for retrieving dropdown data
  lastName: string;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  keyProp,
  valueProp,
  inputValue,
  inputType,
  isValid,
  error,
  handleInputChange,
  validationConfig,
  lastName,
  className="",
}) => {
  const viewType = useResponsiveView();

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

  const isLongText =
    typeof inputValue === "string"
      ? viewType === "mobile"
        ? inputValue.length > 40
        : inputValue.length > 75
      : false;

  if (isLongText) {
    return (
      <TextArea
        name={keyProp}
        value={inputValue as string}
        error={!isValid}
        helperText={error}
        onChange={handleInputChange}
        outerClassProp="h-full flex-1"
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
      outerClassProp={"flex-grow " + className}
    />
  );
};

export default InputField;
