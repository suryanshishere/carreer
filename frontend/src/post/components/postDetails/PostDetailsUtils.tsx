import { POST_LIMITS_DB } from "db/post-db";
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
  rank_minute_num,
  age_num,
} = POST_LIMITS_DB;

const dropdownKeys = [
  "job_type",
  "post_exam_mode",
  "applicants_gender_that_can_apply",
  "stage_level",
];
const longCharKeys = [
  "short_information",
  "highlighted_information",
  "post_importance",
  "how_to_download_admit_card",
  "how_to_download_answer_key",
  "how_to_fill_the_form",
  "registration",
  "apply",
  "how_to_download_result",
  "sources_and_its_step_to_download_syllabus",
  "topics",
];
const mediumCharKeys = ["name_of_the_post"];
const shortCharKeys = [
  "department",
  "age_relaxation",
  "post_name",
  "post_eligibility",
  "additional_resources",
  "minimum_qualification",
  "other_qualification",
  "apply_online",
  "register_now",
  "download_sample_papers",
  "get_admit_card",
  "view_results",
  "check_answer_key",
  "counseling_portal",
  "verify_certificates",
  "faq",
  "contact_us",
  "video_link",
  "section",
];

const nonNegativeNumKeys = [
  "number_of_applicants_each_year",
  "number_of_applicants_selected",
  "total_post",
  "general",
  "obc",
  "sc",
  "st",
  "ews",
  "ph_dviyang",
  "male",
  "female",
];
const rankMinuteNumKeys = ["post_exam_toughness_ranking", "post_exam_duration"];
const ageNumKeys = ["minimum_age", "maximum_age"];

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
  const lastName = keyProp.split(".").pop() || ""; // Extract the last name after "."
  const isLongText = valueType === "string" && (value as string).length > 75;

  // Determine the validation ranges
  const getValidationLimits = () => {
    if (dropdownKeys.includes(lastName)) {
      return { type: "dropdown" };
    } else if (longCharKeys.includes(lastName)) {
      return { min: long_char_limit.min, max: long_char_limit.max };
    } else if (mediumCharKeys.includes(lastName)) {
      return { min: short_char_limit.min, max: short_char_limit.max };
    } else if (shortCharKeys.includes(lastName)) {
      return { min: short_char_limit.min, max: short_char_limit.max };
    } else if (nonNegativeNumKeys.includes(lastName)) {
      return { min: non_negative_num.min, max: non_negative_num.max };
    } else if (rankMinuteNumKeys.includes(lastName)) {
      return { min: rank_minute_num.min, max: rank_minute_num.max };
    } else if (ageNumKeys.includes(lastName)) {
      return { min: age_num.min, max: age_num.max };
    }
    return null;
  };

  const limits = getValidationLimits();

  const validateValue = (): { isValid: boolean; error: string | null } => {
    if (!limits) return { isValid: true, error: null };

    if (limits.type === "dropdown") {
      return { isValid: true, error: null }; //TODO for dropdown validation
    }

    if (valueType === "string") {
      const length = (value as string).length;
      if (
        length < (limits.min || short_char_limit.min) ||
        length > (limits.max || long_char_limit.max)
      ) {
        return {
          isValid: false,
          error: `String length must be between ${limits.min} and ${limits.max} characters.`,
        };
      }
    } else if (valueType === "number" && typeof value === "number") {
      const numValue = value;
      if (
        numValue < (limits.min || non_negative_num.min) ||
        numValue > (limits.max || non_negative_num.max)
      ) {
        return {
          isValid: false,
          error: `Number must be between ${limits.min} and ${limits.max}.`,
        };
      }
    }

    return { isValid: true, error: null };
  };

  const validation = validateValue();

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Render dropdowns for dropdown keys */}
      {limits?.type === "dropdown" ? (
        <Dropdown
          name={lastName}
          data={
            lastName === "job_type"
              ? job_type
              : lastName === "post_exam_mode"
              ? post_exam_mode
              : lastName === "applicants_gender_that_can_apply"
              ? applicants_gender_that_can_apply
              : []
          }
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
          classProp="py-1 bg-custom-white transform ease-linear duration-200"
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
