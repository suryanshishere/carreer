import React from "react";
import { IContributeInputForm } from "models/userModel/account/contributeToPost/IContributeInputForm";
import { formatWord } from "shared/uiComponents/uiUtilComponents/format-word";
import { Dropdown } from "shared/utilComponents/form/input/Dropdown";
import { Input, TextArea } from "shared/utilComponents/form/input/Input";
import TableInput from "shared/utilComponents/form/input/TableInput";
import { ITableFormData } from "./interfaceHelper";

const renderFormFields = (
  data: IContributeInputForm[],
  handleTableInputData: (data: ITableFormData) => void,
  register?: any,  // Optional register prop
  errors?: any     // Optional errors prop
) => {
  return data.map((item, index) => {
    if (["_id"].includes(item.type)) return null;

    if (item.type === "object" && item.subItem) {
      return (
        <div key={index} className="flex flex-col gap-2">
          <h3>{formatWord(item.name)}</h3>
          {renderFormFields(item.subItem, handleTableInputData, register, errors)}
        </div>
      );
    } else if (item.type === "textarea") {
      return (
        <TextArea
          key={index}
          placeholder={formatWord(item.name)}
          {...(register ? register(item.name) : {})}  // Use register only if provided
          error={errors ? !!errors[item.name] : false}  // Set error only if errors exist
          helperText={errors?.[item.name]?.message}     // Set helperText only if errors exist
        />
      );
    } else if (item.value) {
      return (
        <Dropdown
          key={index}
          name={item.name}
          dropdownData={item.value}
          error={errors ? !!errors[item.name] : false}  // Set error only if errors exist
          helperText={errors?.[item.name]?.message}     // Set helperText only if errors exist
          register={register}  // Pass register if provided
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
          placeholder={formatWord(item.name)}
          {...(register ? register(item.name) : {})}  // Use register only if provided
          error={errors ? !!errors[item.name] : false}  // Set error only if errors exist
          helperText={errors?.[item.name]?.message}     // Set helperText only if errors exist
        />
      );
    }
  });
};

export default renderFormFields;
