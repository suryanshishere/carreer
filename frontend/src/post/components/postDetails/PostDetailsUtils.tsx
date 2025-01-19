import { useState } from "react";
import Button from "shared/utils/form/Button";

interface EditableFieldProps {
  value: Date | string | number;
  valueType: "string" | "number" | "object"; // Type of the value
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSave: () => void;
  onUndo: () => void;
  isChanged: boolean;
  isSaved: boolean;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  value,
  valueType,
  onChange,
  onSave,
  onUndo,
  isChanged,
  isSaved,
}) => {
  const isLongText = valueType === "string" && (value as string).length > 75;

  return (
    <div className="flex flex-col gap-2">
      {isLongText ? (
        <textarea
          value={value as string}
          className="outline outline-1 outline-custom-less-gray w-full  pl-2 py-1"
          onChange={onChange}
        />
      ) : (
        <input
          type={
            valueType === "number"
              ? "number"
              : valueType === "object"
              ? "date"
              : "text"
          }
          value={value as string | number}
          className="outline outline-1 outline-custom-less-gray w-full pl-2 py-1"
          onChange={onChange}
        />
      )}
      {isChanged && (
        <button
          onClick={onSave}
          className="bg-custom-blue text-white px-2 py-1 rounded hover:bg-custom-dark-blue transform ease-linear duration-200"
        >
          Save
        </button>
      )}
      {isSaved && (
        <Button
          onClick={onUndo}
          classProp="py-1 bg-custom-white transform ease-linear duration-200"
        >
          Undo
        </Button>
      )}
    </div>
  );
};


interface IRowData {
  [key: string]: string | number;
}

interface DynamicTableProps {
  headers: string[];
  onSaveData: (newData: IRowData[]) => void;
}

const DynamicTable: React.FC<DynamicTableProps> = ({ headers, onSaveData }) => {
  const [tableData, setTableData] = useState<IRowData[]>([]); // Store added rows
  const [tempData, setTempData] = useState<IRowData[]>([]); // Temporary data to save

  const handleAddRow = () => {
    const newRow = headers.reduce((acc, header) => {
      acc[header] = ''; // Initialize each column with an empty value
      return acc;
    }, {} as IRowData);

    setTableData((prevData) => [...prevData, newRow]);
    console.log('Row Added:', newRow);
  };

  const handleRemoveRow = (index: number) => {
    const updatedData = tableData.filter((_, i) => i !== index);
    setTableData(updatedData);
    console.log('Row Removed at Index:', index);
  };

  const handleInputChange = (index: number, key: string, value: string | number) => {
    const updatedData = [...tableData];
    updatedData[index][key] = value;
    setTableData(updatedData);
    console.log('Updated Row:', updatedData[index]);
  };

  const handleSave = () => {
    setTempData([...tempData, ...tableData]); // Store the added rows for saving
    onSaveData(tempData); // Pass data to parent component for saving
    setTableData([]); // Clear the table after saving
    console.log('Data Saved:', tempData);
  };

  return (
    <div>
      <table className="border-collapse border-2 border-custom-gray w-full mt-3">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} className="border border-custom-gray px-2 py-1 text-left">
                {header.replace(/_/g, ' ')}
              </th>
            ))}
            <th className="border border-custom-gray px-2 py-1 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header) => (
                <td key={header} className="border border-custom-gray px-2 py-1">
                  <input
                    type={typeof row[header] === 'number' ? 'number' : 'text'}
                    value={row[header] || ''}
                    onChange={(e) => handleInputChange(rowIndex, header, e.target.value)}
                    className="w-full px-1 py-0.5 border border-gray-300 rounded"
                  />
                </td>
              ))}
              <td className="border border-custom-gray px-2 py-1 text-center">
                <button
                  onClick={() => handleRemoveRow(rowIndex)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleAddRow}
        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Row
      </button>
      <button
        onClick={handleSave}
        className="mt-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Save
      </button>
    </div>
  );
};

export default DynamicTable;