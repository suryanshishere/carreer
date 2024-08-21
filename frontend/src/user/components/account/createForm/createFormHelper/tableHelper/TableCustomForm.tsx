import React, { useState, useEffect } from "react";
import { TableForm, TableFormProps } from "./TableForm";
import { ICreateInputForm } from "models/userModel/create/ICreateInputForm";

const TableCustomForm: React.FC<TableFormProps> = ({
  data,
  onTableInputData,
}) => { 

  return (
    <>
      <TableForm data={data} onTableInputData={onTableInputData} />
    </>
  );
};

export default TableCustomForm;
