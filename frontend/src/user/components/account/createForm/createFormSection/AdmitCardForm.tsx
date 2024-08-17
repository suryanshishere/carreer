import React, { useState } from "react";
import { ICreateForm } from "../createFormHelper/interfaceHelper";
import { ITableFormData,TableForm } from "../createFormHelper/tableHelper";
import POST_COMMON_FORM from "db/userDb/createDb/postCommonFormDb.json";
import { renderFormFields, structureOverallFormData  } from "../createFormHelper/helper";
import Button from "shared/utilComponents/form/Button";

const AdmitCardForm:React.FC<ICreateForm> = ({ idData }) => {
  const [tableFormData, setTableFormData] = useState<ITableFormData>({});

  const tableInputData = (data: Record<string, any>) => {
    setTableFormData(data);
  };

  const submitHandler = (e: React.FormEvent) => {
    const structuredObject = structureOverallFormData (
      e,
      tableFormData,
      POST_COMMON_FORM
    );
    console.log(structuredObject);
  };

  return (
    <form onSubmit={submitHandler} className="flex flex-col gap-2">
      <h2>Post Common Section</h2>
      {renderFormFields(POST_COMMON_FORM, idData)}
      <TableForm data={POST_COMMON_FORM} onTableInputData={tableInputData} />
      <Button>Submit</Button>
    </form>
  );
}

export default AdmitCardForm
