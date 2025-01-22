import { POST_LIMITS } from "env-data";
import { useState } from "react";
import Button from "shared/utils/form/Button";
import Dropdown from "shared/utils/form/Dropdown";

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
  keyProp: string;
}

const {
  short_char_limit,
  long_char_limit,
  non_negative_num,
  job_type,
  applicants_gender_that_can_apply,
  post_exam_mode,
} = POST_LIMITS;

export const EditableField: React.FC<EditableFieldProps> = ({
  value,
  valueType,
  onChange,
  onSave,
  onUndo,
  isChanged,
  isSaved,
  keyProp,
}) => {
  console.log(keyProp);
  const isLongText = valueType === "string" && (value as string).length > 75;
  const validateValue = (): { isValid: boolean; error: string | null } => {
    if (valueType === "string") {
      const length = (value as string).length;
      if (length < short_char_limit.min || length > long_char_limit.max) {
        return {
          isValid: false,
          error: `String length must be between ${short_char_limit.min} and ${long_char_limit.max} characters.`,
        };
      }
    } else if (valueType === "number" && typeof value === "number") {
      const numValue = value;
      if (numValue < non_negative_num.min || numValue > non_negative_num.max) {
        return {
          isValid: false,
          error: `Number must be between ${non_negative_num.min} and ${non_negative_num.max}.`,
        };
      }
    }
    return { isValid: true, error: null };
  };

  const validation = validateValue();

  return (
    <div className="w-full flex flex-col gap-2">
      {keyProp === "common.job_type" ? (
        <Dropdown name="job_type" data={job_type} />
      ) : keyProp === "common.post_exam_mode" ? (
        <Dropdown name="post_exam_mode" data={post_exam_mode} />
      ) : keyProp === "common.applicants_gender_that_can_apply" ? (
        <Dropdown
          name="post_exam_mode"
          data={applicants_gender_that_can_apply}
        />
      ) : isLongText ? (
        <textarea
          value={value as string}
          className={`outline outline-1 outline-custom-less-gray min-h-20 pl-2 py-1 ${
            !validation.isValid ? "outline-custom-red" : ""
          }`}
          onChange={(e) => onChange(e)}
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
          className={`outline outline-1 outline-custom-less-gray pl-2 py-1 ${
            !validation.isValid ? "outline-custom-red" : ""
          }`}
          onChange={(e) => onChange(e)}
        />
      )}
      {!validation.isValid && (
        <span className="text-custom-red text-sm">{validation.error}</span>
      )}
      {isChanged && (
        <button
          onClick={() => {
            if (validation.isValid) onSave();
          }}
          disabled={!validation.isValid}
          className={`px-2 py-1 rounded transform ease-linear duration-200 ${
            validation.isValid
              ? "bg-custom-blue text-custom-white hover:bg-custom-dark-blue"
              : "bg-custom-less-gray text-custom-gray cursor-not-allowed"
          }`}
        >
          Save
        </button>
      )}
      {isSaved && (
        <Button
          onClick={onUndo}
          classProp="py-1 bg-custom-custom-white transform ease-linear duration-200"
        >
          Undo
        </Button>
      )}
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
