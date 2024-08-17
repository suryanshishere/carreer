import React, { useState } from "react";
import { ICreateForm, ITableFormData } from "../createFormHelper/interfaceHelper";
import { TableForm } from "../createFormHelper/tableHelper";
import LATEST_JOB_FORM from "db/userDb/createDb/latestJobFormDb.json";
import { renderFormFields, structureOverallFormData  } from "../createFormHelper/helper";
import Button from "shared/utilComponents/form/Button";

const LatestJobForm:React.FC<ICreateForm> = ({ idData }) => {
  const [tableFormData, setTableFormData] = useState<ITableFormData>({});

  const tableInputData = (data: Record<string, any>) => {
    setTableFormData(data);
  };

  const submitHandler = (e: React.FormEvent) => {
    const structuredObject = structureOverallFormData (
      e,
      tableFormData,
      LATEST_JOB_FORM
    );
    console.log(structuredObject);
  };

  return (
    <form onSubmit={submitHandler} className="flex flex-col gap-2">
      <h2>Post Common Section</h2>
      {renderFormFields(LATEST_JOB_FORM, idData)}
      <TableForm data={LATEST_JOB_FORM} onTableInputData={tableInputData} />
      <Button>Submit</Button>
    </form>
  );
}

export default LatestJobForm