import { IPostAdminData } from "models/admin/IPostAdminData";
import { formatWord } from "shared/uiComponents/uiUtilComponents/format-word";
import { Dropdown } from "shared/utilComponents/form/input/Dropdown";
import { Input } from "shared/utilComponents/form/input/Input";
import DynamicForm from "./tableHelper";

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
  formFields: any[],
  idData?: IPostAdminData[],
  onOtherData?: (data: Record<string, any>) => void
) => {
  return formFields.map((item, index) => {
    if (item.type === "array" && onOtherData !== undefined){
      return(
        <DynamicForm name={item.name} data={item.subItem} inputData={onOtherData}/>
      )
    }
    else if (item.type === "object" ) {
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
        <Dropdown
          key={index}
          name={item.name}
          dropdownData={item.value}
        />
      );
    }  else {
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
