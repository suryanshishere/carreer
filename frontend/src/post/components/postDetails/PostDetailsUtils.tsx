import { POST_LIMITS_DB } from "db/post-db";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "shared/store";
import { removeKeyValuePair, setKeyValuePair } from "shared/store/post-slice";
import Button from "shared/utils/form/Button";
import Dropdown from "shared/utils/form/Dropdown";
import { Input, TextArea } from "shared/utils/form/Input";
import {
  getFieldValidation,
  validateFieldValue,
} from "./postDetailsUtils/editable-validation";

//FOR DATE 

interface EditableFieldProps {
  value: Date | string | number;
  keyProp: string;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  value,
  keyProp,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [inputValue, setInputValue] = useState<Date | string | number>(
    value instanceof Date ? value.toISOString().slice(0, 10) : value
  );
  const [isChanged, setIsChanged] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const lastName = keyProp.split(".").pop() || ""; // Extract the last name after "."
  const validationConfig = getFieldValidation(lastName);
  const { isValid, error } = validateFieldValue(
    inputValue instanceof Date ? inputValue.toISOString() : inputValue,
    validationConfig
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const newValue =
      typeof value === "number" ? +e.target.value : e.target.value;
    setInputValue(newValue);
    setIsChanged(true);
    setIsSaved(false);
  };

  const handleSave = () => {
    const parsedValue =
      typeof value === "number"
        ? +inputValue
        : typeof value === "string"
        ? inputValue.toString()
        : new Date(inputValue as string);

    dispatch(setKeyValuePair({ key: keyProp, value: parsedValue }));
    setIsChanged(false);
    setIsSaved(true);
  };

  const handleUndo = () => {
    setInputValue(value instanceof Date ? value.toISOString() : value);
    dispatch(removeKeyValuePair(keyProp));
    setIsChanged(false);
    setIsSaved(false);
  };

  const renderInputField = () => {
    if (validationConfig?.type === "dropdown") {
      return (
        <Dropdown
          name={keyProp}
          defaultValue={value}
          data={(POST_LIMITS_DB as any)[lastName] ?? []}
          onChange={handleInputChange}
        />
      );
    }

    const isLongText = typeof value === "string" && value.length > 75;
    const inputType =
      typeof value === "number"
        ? "number"
        : value instanceof Date
        ? "date"
        : "text";

    if (isLongText) {
      return (
        <TextArea
          name={keyProp}
          value={inputValue as string}
          error={!isValid}
          helperText={error}
          onChange={handleInputChange}
        />
      );
    }

    return (
      <Input
        name={keyProp}
        type={inputType}
        value={inputValue as string | number}
        error={!isValid}
        helperText={error}
        onChange={handleInputChange}
      />
    );
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {renderInputField()}

      <div className="w-full flex items-center gap-2">
        {isSaved && (
          <Button
            onClick={handleUndo}
            classProp="py-1 bg-custom-white transform ease-linear duration-200"
          >
            Undo
          </Button>
        )}

        {isChanged && (
          <Button
            contributeSaveButton
            onClick={() => {
              if (isValid) handleSave();
            }}
            disabled={!isValid}
            className={`flex-1 px-2 py-1 rounded transform ease-linear duration-200 ${
              isValid
                ? "bg-custom-blue text-custom-white hover:bg-custom-dark-blue"
                : "bg-custom-less-gray text-custom-gray cursor-not-allowed"
            }`}
          >
            Save
          </Button>
        )}
      </div>
    </div>
  );
};

//TODO-------------------------------------------------------
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
      acc[header] = ""; // Initialize each column with an empty value
      return acc;
    }, {} as IRowData);

    setTableData((prevData) => [...prevData, newRow]);
    console.log("Row Added:", newRow);
  };

  const handleRemoveRow = (index: number) => {
    const updatedData = tableData.filter((_, i) => i !== index);
    setTableData(updatedData);
    console.log("Row Removed at Index:", index);
  };

  const handleInputChange = (
    index: number,
    key: string,
    value: string | number
  ) => {
    const updatedData = [...tableData];
    updatedData[index][key] = value;
    setTableData(updatedData);
    console.log("Updated Row:", updatedData[index]);
  };

  const handleSave = () => {
    setTempData([...tempData, ...tableData]); // Store the added rows for saving
    onSaveData(tempData); // Pass data to parent component for saving
    setTableData([]); // Clear the table after saving
    console.log("Data Saved:", tempData);
  };

  return (
    <div>
      <table className="border-collapse border-2 border-custom-gray w-full mt-3">
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="border border-custom-gray px-2 py-1 text-left"
              >
                {header.replace(/_/g, " ")}
              </th>
            ))}
            <th className="border border-custom-gray px-2 py-1 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header) => (
                <td
                  key={header}
                  className="border border-custom-gray px-2 py-1"
                >
                  <input
                    type={typeof row[header] === "number" ? "number" : "text"}
                    value={row[header] || ""}
                    onChange={(e) =>
                      handleInputChange(rowIndex, header, e.target.value)
                    }
                    className="w-full px-1 py-0.5 border border-gray-300 rounded"
                  />
                </td>
              ))}
              <td className="border border-custom-gray px-2 py-1 text-center">
                <button
                  onClick={() => handleRemoveRow(rowIndex)}
                  className="text-custom-red hover:underline"
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
        className="mt-3 px-4 py-2 bg-custom-blue text-custom-white rounded hover:bg-custom-blue"
      >
        Add Row
      </button>
      <button
        onClick={handleSave}
        className="mt-3 px-4 py-2 bg-custom-green text-custom-white rounded hover:bg-green-600"
      >
        Save
      </button>
    </div>
  );
};

export default DynamicTable;
