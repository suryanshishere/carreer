import React, { useState } from "react";

// Define the type for each input field
interface Field {
  name: string;
  type: string;
}

// Define the type for the props
interface DynamicFormProps {
  name: string;
  data: Field[];
  inputData: (data: Record<string, any>) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ name, data, inputData }) => {
  // Define RowData type
  interface RowData {
    [key: string]: string | number;
  }

  // Initialize state with a single empty row
  const initializeRow = () =>
    data.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {} as RowData);

  const [tableArray, setTableArray] = useState<RowData[]>([initializeRow()]);

  inputData({ [name]: tableArray });

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    const newTableArray = [...tableArray];
    newTableArray[index] = {
      ...newTableArray[index],
      [name]: value,
    };
    setTableArray(newTableArray);
  };

  const addRow = () => {
    setTableArray([...tableArray, initializeRow()]);
  };

  const removeRow = (index: number) => {
    const newTableArray = tableArray.filter((_, i) => i !== index);
    setTableArray(newTableArray);
  };

  return (
    <>
      {tableArray.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {data.map((field) => (
            <input
              key={field.name}
              type={field.type}
              name={field.name}
              value={row[field.name] || ""}
              onChange={(e) => handleInputChange(rowIndex, e)}
              placeholder={field.name}
            />
          ))}
          <button type="button" onClick={() => removeRow(rowIndex)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={addRow}>
        Add Row
      </button>
      {/* <button type="submit" onClick={handleSubmit}>
        Submit
      </button> */}
    </>
  );
};

export default DynamicForm;
