import React, { useState } from "react";
import { ICreateForm, ITableFormData } from "../createFormHelper/interfaceHelper";
import { TableForm } from "../createFormHelper/tableHelper";
import RESULT_FORM from "db/userDb/createDb/resultFormDb.json";
import { renderFormFields, structureOverallFormData  } from "../createFormHelper/helper";
import Button from "shared/utilComponents/form/Button";

const ResultForm:React.FC<ICreateForm> = ({ idData }) => {
  const [tableFormData, setTableFormData] = useState<ITableFormData>({});

  const tableInputData = (data: Record<string, any>) => {
    setTableFormData(data);
  };

  const submitHandler = (e: React.FormEvent) => {
    const structuredObject = structureOverallFormData (
      e,
      tableFormData,
      RESULT_FORM
    );
    console.log(structuredObject);
  };

  return (
    <form onSubmit={submitHandler} className="flex flex-col gap-2">
      <h2>Post Common Section</h2>
      {renderFormFields(RESULT_FORM, idData)}
      <TableForm data={RESULT_FORM} onTableInputData={tableInputData} />
      <Button>Submit</Button>
    </form>
  );
}

export default ResultForm