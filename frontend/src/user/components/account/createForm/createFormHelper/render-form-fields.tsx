import React from "react";
import { IContributeInputForm } from "models/userModel/account/contributeToPost/IContributeInputForm";
import { formatWord } from "shared/uiComponents/uiUtilComponents/format-word";
import { Dropdown } from "shared/utilComponents/form/input/Dropdown";
import { Input, TextArea } from "shared/utilComponents/form/input/Input";
import TableInput from "shared/utilComponents/form/input/TableInput";

const renderFormFields = (
  data: IContributeInputForm[],
  handleTableInputData?: (data: Record<string, any>) => void 
) => {
  return data.map((item, index) => {
    if (["_id"].includes(item.type)) return null;

    if (item.type === "object" && item.subItem) {
      return (
        <div key={index} className="flex flex-col gap-2">
          <h3>{formatWord(item.name)}</h3>
          {renderFormFields(item.subItem, handleTableInputData)}
        </div>
      );
    } else if (item.type === "textarea") {
      return <TextArea key={index} name={item.name} />;
    } else if (item.value) {
      return (
        <Dropdown key={index} name={item.name} dropdownData={item.value} />
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
      return <Input key={index} name={item.name} type={item.type} />;
    }
  });
};

export default renderFormFields;
