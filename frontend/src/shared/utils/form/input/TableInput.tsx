import React, { useState } from "react";
import {
  Box,
  Grid,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
} from "@mui/material";
import { IContributeInputForm } from "models/userModel/account/contributeToPost/IContributeInputForm";
import { formatWord } from "shared/quick/format-word";
import { TextArea } from "./Input";
import Button from "../Button";

interface SubItem {
  name: string;
  type: "text" | "number" | "date"; // Explicit types for subitem
}

interface TableInputProps {
  data: IContributeInputForm;
  tableInputData?: (data: Record<string, any>) => void; // Add prop for callback
}

const TableInput: React.FC<TableInputProps> = ({ data, tableInputData }) => {
  const isCustomArray = data.type === "customArray"; // Check if type is customArray
  const initialColumnNames = data.subItem?.map((item) => item.name) || [];

  // Initialize column types based on subItem types
  const initialColumnTypes: string[] = data.subItem?.map(
    (item) => item.type
  ) || ["text"];

  const [columnNames, setColumnNames] = useState<string[]>(initialColumnNames); // Initialize with subItem names
  const [columnTypes, setColumnTypes] = useState<string[]>(initialColumnTypes); // Initialize column types
  const [tableData, setTableData] = useState<string[][]>(
    initialColumnNames.length > 0
      ? [new Array(initialColumnNames.length).fill("")]
      : []
  ); // Initialize table data
  const [isSaved, setIsSaved] = useState<boolean>(false); // Track save state

  // Handle cell input changes
  const handleInputChange = (
    rowIndex: number,
    columnIndex: number,
    value: string
  ) => {
    const updatedTableData = [...tableData];
    updatedTableData[rowIndex][columnIndex] = value;
    setTableData(updatedTableData);
    setIsSaved(false); // Mark as unsaved after changes
  };

  // Add a new row to the table
  const addRow = () => {
    setTableData([...tableData, new Array(columnNames.length).fill("")]); // Add an empty row based on column length
    setIsSaved(false); // Mark as unsaved after changes
  };

  // Remove a row from the table
  const removeRow = (rowIndex: number) => {
    setTableData(tableData.filter((_, index) => index !== rowIndex)); // Remove the row by filtering it out
    setIsSaved(false); // Mark as unsaved after changes
  };

  // Handle column name changes if it's a customArray
  const handleColumnChange = (columnIndex: number, value: string) => {
    if (isCustomArray) {
      const updatedColumns = [...columnNames];
      updatedColumns[columnIndex] = value;
      setColumnNames(updatedColumns);
      setIsSaved(false); // Mark as unsaved after changes
    }
  };

  // Handle column type changes if it's a customArray
  const handleColumnTypeChange = (
    columnIndex: number,
    value: SubItem["type"]
  ) => {
    if (isCustomArray) {
      const updatedTypes = [...columnTypes];
      updatedTypes[columnIndex] = value;
      setColumnTypes(updatedTypes);
      setIsSaved(false); // Mark as unsaved after changes
    }
  };

  // Add a new column dynamically (only if type is customArray)
  const addColumn = () => {
    if (isCustomArray) {
      const newColumnName = `Column ${columnNames.length + 1}`;
      setColumnNames([...columnNames, newColumnName]); // Add a new column with a default name
      setColumnTypes([...columnTypes, "text"]); // Default new column type as "text"
      setTableData(tableData.map((row) => [...row, ""])); // Add an empty cell to each row
      setIsSaved(false); // Mark as unsaved after changes
    }
  };

  // Save data as JSON and call the parent callback
  const saveAsJSON = () => {
    if (isSaved) return; // Prevent re-saving the same data
    const jsonData = tableData.map((row) =>
      row.reduce(
        (acc, cell, index) => ({ ...acc, [columnNames[index]]: cell }),
        {}
      )
    );
    const finalData = {
      [data.name]: jsonData, // Use top-level name as key
    };
    console.log(JSON.stringify(finalData, null, 2));
    if (tableInputData) {
      tableInputData(finalData); // Pass data to parent
    }
    setIsSaved(true); // Mark as saved after the process
  };

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold mb-4">{formatWord(data.name)}</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columnNames.map((col, index) => (
                <TableCell key={index}>
                  <TextField
                    label={`Column ${index + 1}`}
                    value={col}
                    onChange={(e) =>
                      isCustomArray && handleColumnChange(index, e.target.value)
                    }
                    disabled={!isCustomArray}
                    fullWidth
                  />
                  {isCustomArray && (
                    <TextField
                      select
                      value={columnTypes[index]}
                      onChange={(e) =>
                        handleColumnTypeChange(
                          index,
                          e.target.value as SubItem["type"]
                        )
                      }
                      fullWidth
                      margin="dense"
                    >
                      <MenuItem value="text">Text</MenuItem>
                      <MenuItem value="number">Number</MenuItem>
                      <MenuItem value="date">Date</MenuItem>
                    </TextField>
                  )}
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, columnIndex) => (
                  <TableCell key={columnIndex}>
                    <TextArea
                      name={""}
                      // row={1}
                      type={columnTypes[columnIndex]}
                      value={cell}
                      onChange={(e) =>
                        handleInputChange(rowIndex, columnIndex, e.target.value)
                      }
                      // fullWidth
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <Button
                    color="error"
                    onClick={() => removeRow(rowIndex)}
                  >
                    Remove row
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className=" flex gap-2">
        <Button  onClick={addRow}>
          Add Row
        </Button>
        {isCustomArray && (
            <Button  onClick={addColumn}>
              Add Column
            </Button>
        )}
        <Button  onClick={saveAsJSON} disabled={isSaved}>
          Save as JSON
        </Button>
      </div>
    </div>
  );
};

export default TableInput;
