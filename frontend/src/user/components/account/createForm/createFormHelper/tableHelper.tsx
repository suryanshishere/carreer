import { ICreateInputForm } from "models/userModel/create/ICreateInputForm";
import React, { useEffect, useState } from "react";
import { RowData } from "./interfaceHelper";

// Define the type for the props
interface TableFormProps {
  data: ICreateInputForm[];
  onTableInputData: (data: Record<string, any>) => void;
}

export const TableForm: React.FC<TableFormProps> = ({
  data,
  onTableInputData,
}) => {
  // Initialize state with an empty object for each table
  const initializeRow = (subItems: ICreateInputForm[]) =>
    subItems.reduce(
      (acc, field) => ({ ...acc, [field.name]: "" }),
      {} as RowData
    );

  const initializeTable = () =>
    data.reduce((acc, item) => {
      if (item.type === "array" && item.subItem) {
        acc[item.name] = [initializeRow(item.subItem)];
      }
      return acc;
    }, {} as Record<string, RowData[]>);

  const [tablesData, setTablesData] = useState<Record<string, RowData[]>>(
    initializeTable()
  );

  const handleInputChange = (
    tableName: string,
    rowIndex: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = event.target;

    let parsedValue: string | number | boolean = value;

    // Parse the value based on the input type
    switch (type) {
      case "number":
        parsedValue = Number(value);
        break;
      case "checkbox":
        parsedValue = event.target.checked;
        break;
      case "text":
      default:
        parsedValue = value;
        break;
    }

    const newTableArray = [...tablesData[tableName]];
    newTableArray[rowIndex] = {
      ...newTableArray[rowIndex],
      [name]: parsedValue,
    };
    setTablesData({
      ...tablesData,
      [tableName]: newTableArray,
    });
  };

  const addRow = (tableName: string, subItems: ICreateInputForm[]) => {
    setTablesData({
      ...tablesData,
      [tableName]: [...tablesData[tableName], initializeRow(subItems)],
    });
  };

  const removeRow = (tableName: string, rowIndex: number) => {
    const newTableArray = tablesData[tableName].filter(
      (_, i) => i !== rowIndex
    );
    setTablesData({
      ...tablesData,
      [tableName]: newTableArray,
    });
  };

  useEffect(() => {
    onTableInputData(tablesData);
  }, [tablesData]);

  return (
    <>
      {data
        .filter((item) => item.type === "customArray")
        && <div>cool</div> }
      {data
        .filter((item) => item.type === "array" && item.subItem)
        .map((item, itemIndex) => (
          <div key={itemIndex} className="table-section">
            <h3>{item.name}</h3>
            {tablesData[item.name]?.map((row, rowIndex) => (
              <div key={rowIndex} className="row">
                {item.subItem!.map((field) => {
                  const fieldValue = row[field.name];
                  const displayValue =
                    field.type === "checkbox"
                      ? Boolean(fieldValue)
                      : fieldValue || "";

                  return (
                    <div key={field.name}>
                      {field.type === "number" || field.type === "text" ? (
                        <input
                          key={field.name}
                          type={field.type}
                          name={field.name}
                          value={
                            typeof displayValue === "string" ||
                            typeof displayValue === "number"
                              ? displayValue
                              : ""
                          }
                          onChange={(e) =>
                            handleInputChange(item.name, rowIndex, e)
                          }
                          placeholder={field.name}
                        />
                      ) : field.type === "checkbox" ? (
                        <input
                          key={field.name}
                          type="checkbox"
                          name={field.name}
                          checked={Boolean(displayValue)}
                          onChange={(e) =>
                            handleInputChange(item.name, rowIndex, e)
                          }
                        />
                      ) : null}
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={() => removeRow(item.name, rowIndex)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addRow(item.name, item.subItem!)}
            >
              Add Row
            </button>
          </div>
        ))}
    </>
  );
};
