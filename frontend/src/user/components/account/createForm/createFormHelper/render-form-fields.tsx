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
  register?: any, // Optional register prop
  errors?: any, // Optional errors prop
  parentName?: string // Add a parentName prop to track the field path
) => {
  return data.map((item, index) => {
    // Skip rendering for _id fields
    if (["_id"].includes(item.type)) return null;

    // Create a field name that reflects the nested structure
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
            fieldName // Pass the current field name as the parent
          )}
        </div>
      );
    } else if (item.type === "textarea") {
      return (
        <TextArea
          key={index}
          name={fieldName}
          placeholder={formatWord(item.name)}
          {...(register ? register(fieldName) : {})} // Use the updated field name for registration
          error={errors ? !!errors[item.name] : false} // Set error only if errors exist
          helperText={errors?.[item.name]?.message} // Set helperText only if errors exist
        />
      );
    } else if (item.value) {
      return (
        <Dropdown
          key={index}
          name={fieldName}
          dropdownData={item.value}
          error={errors ? !!errors[item.name] : false} // Set error only if errors exist
          helperText={errors?.[item.name]?.message} // Set helperText only if errors exist
          register={register} // Pass register if provided
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
          name={fieldName} // Use the updated field name for registration
          type={item.type}
          placeholder={formatWord(item.name)}
          {...(register ? register(fieldName) : {})} // Use the updated field name for registration
          error={errors ? !!errors[item.name] : false} // Set error only if errors exist
          helperText={errors?.[item.name]?.message} // Set helperText only if errors exist
        />
      );
    }
  });
};


export default renderFormFields;
