import React from "react";
import { POST_LIMITS_DB } from "posts/db";
import { Input, TextArea } from "shared/utils/form/Input";
import Dropdown from "shared/utils/form/Dropdown";
import { IValidationConfig } from "./post-editable-utils";

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
}) => {
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

export default InputField;
