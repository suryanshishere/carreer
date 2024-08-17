import { IPostAdminData } from "models/admin/IPostAdminData";
import { ICreateInputForm } from "models/userModel/create/ICreateInputForm";
import { formatWord } from "shared/uiComponents/uiUtilComponents/format-word";
import { Dropdown } from "shared/utilComponents/form/input/Dropdown";
import { Input } from "shared/utilComponents/form/input/Input";
import { ITableFormData } from "./tableHelper";

export const structureFormData = (
  formData: Record<string, any>,
  formFields: any[]
): Record<string, any> => {
  const structuredData: Record<string, any> = {};

  formFields.forEach((field) => {
    if (field.type === "object") {
      structuredData[field.name] = structureFormData(formData, field.subItem);
    } else {
      let value = formData[field.name];

      // Convert value to number if the field type is number
      if (field.type === "number" && value !== undefined) {
        value = Number(value);
      }

      structuredData[field.name] = value;
    }
  });

  return structuredData;
};

export const renderFormFields = (
  data: ICreateInputForm[],
  idData?: IPostAdminData[]
) => {
  return data.map((item, index) => {
    if (item.type === "array") {
      return null;
    } else if (item.type === "object" && item.subItem !== undefined) {
      return (
        <div key={index} className="flex flex-col gap-2">
          <h3>{formatWord(item.name)}</h3>
          {renderFormFields(item.subItem)}
        </div>
      );
    } else if (item.name === "_id") {
      return (
        <Dropdown
          key={index}
          label="Post"
          name={item.name}
          dropdownData={idData || []}
        />
      );
    } else if (item.value !== undefined) {
      return (
        <Dropdown key={index} name={item.name} dropdownData={item.value} />
      );
    } else {
      return (
        <Input
          key={index}
          name={item.name}
          type={item.type === "number" ? "number" : "text"}
        />
      );
    }
  });
};

export const structureOverallFormData = (
  e: React.FormEvent,
  tableFormData: ITableFormData,
  data: ICreateInputForm[]
) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget as HTMLFormElement);
  const formValues: Record<string, any> = {};

  formData.forEach((value, key) => {
    if (formValues[key]) {
      if (Array.isArray(formValues[key])) {
        formValues[key].push(value);
      } else {
        formValues[key] = [formValues[key], value];
      }
    } else {
      formValues[key] = value;
    }
  });

  const structuredData = structureFormData(formValues, data);

  // Merge the dynamic form data with the structured data
  const finalStructuredData = {
    ...structuredData,
    ...tableFormData,
  };

  return finalStructuredData;
};
