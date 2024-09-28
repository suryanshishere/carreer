import React, { useState } from "react";
import { IContributeInputForm } from "models/userModel/account/contributeToPost/IContributeInputForm";

interface SubItem {
  name: string;
  type: "text" | "number" | "date"; // Explicit types for subitem
}

interface TableProps {
  name: string;
  type: "array" | "customArray"; // Include customArray type
  subItem?: SubItem[]; // Optional for customArray
}

interface TableInputProps {
  data: IContributeInputForm;
  tableInputData: (data: Record<string, any>) => void; // Add prop for callback
}

const TableInput: React.FC<TableInputProps> = ({ data, tableInputData }) => {
  const isCustomArray = data.type === "customArray"; // Check if type is customArray
  const initialColumnNames = data.subItem?.map((item) => item.name) || [];
  
  // Initialize column types based on subItem types
  const initialColumnTypes: string[] = data.subItem?.map((item) => item.type) || ["text"];

  const [columnNames, setColumnNames] = useState<string[]>(initialColumnNames); // Initialize with subItem names
  const [columnTypes, setColumnTypes] = useState<string[]>(initialColumnTypes); // Initialize column types
  const [tableData, setTableData] = useState<string[][]>(initialColumnNames.length > 0 ? [new Array(initialColumnNames.length).fill("")] : []); // Initialize table data

  // Handle cell input changes
  const handleInputChange = (rowIndex: number, columnIndex: number, value: string) => {
    const updatedTableData = [...tableData];
    updatedTableData[rowIndex][columnIndex] = value;
    setTableData(updatedTableData);
  };

  // Add a new row to the table
  const addRow = () => {
    setTableData([...tableData, new Array(columnNames.length).fill("")]); // Add an empty row based on column length
  };

  // Handle column name changes if it's a customArray
  const handleColumnChange = (columnIndex: number, value: string) => {
    if (isCustomArray) {
      const updatedColumns = [...columnNames];
      updatedColumns[columnIndex] = value;
      setColumnNames(updatedColumns);
    }
  };

  // Handle column type changes if it's a customArray
  const handleColumnTypeChange = (columnIndex: number, value: SubItem["type"]) => {
    if (isCustomArray) {
      const updatedTypes = [...columnTypes];
      updatedTypes[columnIndex] = value;
      setColumnTypes(updatedTypes);
    }
  };

  // Add a new column dynamically (only if type is customArray)
  const addColumn = () => {
    if (isCustomArray) {
      const newColumnName = `Column ${columnNames.length + 1}`;
      setColumnNames([...columnNames, newColumnName]); // Add a new column with a default name
      setColumnTypes([...columnTypes, "text"]); // Default new column type as "text"
      setTableData(tableData.map((row) => [...row, ""])); // Add an empty cell to each row
    }
  };

  // Save data as JSON and call the parent callback
  const saveAsJSON = () => {
    const jsonData = tableData.map((row) =>
      row.reduce(
        (acc, cell, index) => ({ ...acc, [columnNames[index]]: cell }),
        {}
      )
    );
    const finalData = {
      [data.name]: jsonData, // Use top-level name as key
    };
    console.log(JSON.stringify(finalData, null, 2)); // Log formatted JSON for clarity
    tableInputData(finalData); // Pass data to parent
  };

  return (
    <div>
      <h3>Dynamic Table: {data.name}</h3>
      <table>
        <thead>
          <tr>
            {columnNames.map((col, index) => (
              <th key={index}>
                <input
                  type="text"
                  value={col}
                  onChange={(e) => isCustomArray && handleColumnChange(index, e.target.value)}
                  disabled={!isCustomArray} 
                />
                {isCustomArray && (
                  <select
                    value={columnTypes[index]} 
                    onChange={(e) => handleColumnTypeChange(index, e.target.value as SubItem['type'])} 
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                  </select>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, columnIndex) => (
                <td key={columnIndex}>
                  <input
                    type={columnTypes[columnIndex]} // Use the correct input type based on columnTypes
                    value={cell}
                    onChange={(e) => handleInputChange(rowIndex, columnIndex, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: "10px" }}>
        <button type="button" onClick={addRow}>Add Row</button>
        {isCustomArray && (
          <button type="button" onClick={addColumn} style={{ marginLeft: "10px" }}>
            Add Column
          </button>
        )}
        <button type="button" onClick={saveAsJSON} style={{ marginLeft: "10px" }}>
          Save as JSON
        </button>
      </div>
    </div>
  );
};

export default TableInput;
