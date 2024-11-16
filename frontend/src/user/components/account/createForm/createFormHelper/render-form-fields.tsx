import React from "react";
import { IContributeInputForm } from "models/userModel/account/contributeToPost/IContributeInputForm";
import { formatWord } from "shared/quick/format-word";
import { Dropdown } from "shared/utils/form/input/Dropdown";
import { Input, TextArea } from "shared/utils/form/input/Input";
import TableInput from "shared/utils/form/input/TableInput";
import { ITableFormData } from "./interfaceHelper";

const renderFormFields = (
  data: IContributeInputForm[],
  handleTableInputData: (data: ITableFormData) => void,
  register?: any,
  errors?: any,
  parentName?: string
) => {
  return data.map((item, index) => {
    if (["_id"].includes(item.type)) return null;
    const fieldName = parentName ? `${parentName}.${item.name}` : item.name;

    if (item.type === "object" && item.subItem) {
      return (
        <div key={index} className="flex flex-col gap-2">
          <h3>{formatWord(item.name)}</h3>
          {renderFormFields(
            item.subItem,
            handleTableInputData,
            register,
            errors,
            fieldName
          )}
        </div>
      );
    } else if (item.type === "textarea") {
      return (
        <TextArea
          key={index}
          name={fieldName}
          placeholder={formatWord(item.name)}
          {...(register ? register(fieldName) : {})}
          error={errors ? !!errors[fieldName] : false}
          helperText={errors?.[fieldName]?.message}
        />
      );
    } else if (item.value) {
      return (
        <Dropdown
          key={index}
          name={fieldName}
          dropdownData={item.value}
          error={errors ? !!errors[fieldName] : false}
          helperText={errors?.[fieldName]?.message}
          register={register}
        />
      );
    } else if (item.type === "customArray" || item.type === "array") {
      return (
        <TableInput
          key={index}
          data={item}
          tableInputData={handleTableInputData}
        />
      );
    } else {
      return (
        <Input
          key={index}
          name={fieldName}
          type={item.type}
          placeholder={formatWord(item.name)}
          {...(register ? register(fieldName) : {})}
          error={errors ? !!errors[fieldName] : false}
          helperText={errors?.[fieldName]?.message}
        />
      );
    }
  });
};

export default renderFormFields;
