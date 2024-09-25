import { IContributeInputForm } from "models/userModel/account/contributeToPost/IContributeInputForm";
import { ITableFormData } from "./interfaceHelper";

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


export const structureOverallFormData = (
  e: React.FormEvent,
  tableFormData: ITableFormData,
  data: IContributeInputForm[]
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
