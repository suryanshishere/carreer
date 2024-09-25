import { IPostAdminData } from "models/admin/IPostAdminData";
import { IContributeInputForm } from "models/userModel/account/contributeToPost/IContributeInputForm";
import { formatWord } from "shared/uiComponents/uiUtilComponents/format-word";
import { Dropdown } from "shared/utilComponents/form/input/Dropdown";
import { Input, TextArea } from "shared/utilComponents/form/input/Input";
import { ITableFormData } from "./interfaceHelper";

const renderFormFields = (data: IContributeInputForm[]) => {
  return data.map((item, index) => {
    if (["array", "customArray", "_id"].includes(item.type)) return null;

    if (item.type === "object" && item.subItem) {
      return (
        <div key={index} className="flex flex-col gap-2">
          <h3>{formatWord(item.name)}</h3>
          {renderFormFields(item.subItem)}
        </div>
      );
    }

    if (item.name === "_id" && item.value) {
      return (
        <Dropdown
          key={index}
          label="Post"
          name={item.name}
          dropdownData={item.value}
        />
      );
    }

    if (item.value) {
      return (
        <Dropdown key={index} name={item.name} dropdownData={item.value} />
      );
    }

    if (item.type === "textarea") {
      return <TextArea key={index} name={item.name} />;
    }

    return <Input key={index} name={item.name} type={item.type} />;
  });
};

export default renderFormFields;
