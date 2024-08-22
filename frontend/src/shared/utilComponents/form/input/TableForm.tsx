import { ICreateInputForm } from "models/userModel/create/ICreateInputForm";
import React, { useEffect, useState } from "react";
import { RowData } from "../../../../user/components/account/createForm/createFormHelper/interfaceHelper";
import { Input, TextArea } from "shared/utilComponents/form/input/Input";

export interface TableFormProps {
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

  const initializeTable = (data: ICreateInputForm[]) =>
    data.reduce((acc, item) => {
      if (item.type === "array" && item.subItem) {
        acc[item.name] = [initializeRow(item.subItem)];
      }
      return acc;
    }, {} as Record<string, RowData[]>);

  const [tablesData, setTablesData] = useState<Record<string, RowData[]>>(
    initializeTable(data)
  );

  useEffect(() => {
    // Re-initialize tablesData when data prop changes
    setTablesData(initializeTable(data));
  }, [data]);

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
  }, [tablesData, onTableInputData]);

  return (
    <>
      {data
        .filter(
          (item) =>
            item.type === "array" &&
            item.subItem !== undefined &&
            item.subItem.length > 0
        )
        .map((item, itemIndex) => (
          <div key={itemIndex} className="flex flex-col gap-2">
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
                        <Input
                          name={field.name}
                          type={field.type}
                          value={
                            typeof displayValue === "string" ||
                            typeof displayValue === "number"
                              ? displayValue
                              : ""
                          }
                          onChange={(e) =>
                            handleInputChange(item.name, rowIndex, e)
                          }
                        />
                      ) : field.type === "checkbox" ? (
                        <Input
                          type="checkbox"
                          name={field.name}
                          checked={Boolean(displayValue)}
                          onChange={(e) =>
                            handleInputChange(item.name, rowIndex, e)
                          }
                        />
                      ) : field.type === "textarea" ? (
                        <TextArea
                          name={field.name}
                          value={displayValue as string}
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
