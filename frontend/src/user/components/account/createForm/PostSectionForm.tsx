import React, { useState } from "react";
import { renderFormFields, structureOverallFormData  } from "./createFormHelper/helper";
import Button from "shared/utilComponents/form/Button";
import { TableForm} from "../../../../shared/utilComponents/form/input/TableForm";
import { ICreateSection, ITableFormData } from "./createFormHelper/interfaceHelper";
import TableCustomForm from "../../../../shared/utilComponents/form/input/TableCustomForm";


const PostSectionForm:React.FC<ICreateSection> = ({ postformData }) => {
  const [tableFormData, setTableFormData] = useState<ITableFormData>({});

  const tableInputData = (data: Record<string, any>) => {
    setTableFormData(data);
  };

  const submitHandler = (e: React.FormEvent) => {
    const structuredObject = structureOverallFormData (
      e,
      tableFormData,
      postformData
    );
    console.log(structuredObject);
  };

  return (
    <form onSubmit={submitHandler} className="flex flex-col gap-2">
      <h2>Post Common Section</h2>
      {renderFormFields(postformData)}
      <TableCustomForm data={postformData} onTableInputData={tableInputData} />
      <Button>Submit</Button>
    </form>
  );
};

export default PostSectionForm;
