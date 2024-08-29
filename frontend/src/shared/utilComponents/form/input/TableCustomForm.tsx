import React, { useState, useEffect } from "react";
import { TableForm, TableFormProps } from "./TableForm";
import { IContributeInputForm } from "models/userModel/account/contributeToPost/IContributeInputForm";

const TableCustomForm: React.FC<TableFormProps> = ({
  data,
  onTableInputData,
}) => {
  const [filteredData, setFilteredData] = useState(
    data.filter((item) => item.type === "customArray")
  );

  const [inputValues, setInputValues] = useState<{ [key: string]: string[] }>(
    {}
  );
  const [selectValues, setSelectValues] = useState<{ [key: string]: string[] }>(
    {}
  );

  useEffect(() => {
    // Initialize inputValues and selectValues for each item in filteredData
    filteredData.forEach((item) => {
      if (!inputValues[item.name]) {
        setInputValues((prev) => ({
          ...prev,
          [item.name]: item.subItem?.map((subItem) => subItem.name) || [""],
        }));
      }
      if (!selectValues[item.name]) {
        setSelectValues((prev) => ({
          ...prev,
          [item.name]: item.subItem?.map((subItem) => subItem.type) || ["text"],
        }));
      }
    });
  }, [filteredData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string,
    index: number
  ) => {
    setInputValues((prev) => ({
      ...prev,
      [name]: prev[name].map((val, i) => (i === index ? e.target.value : val)),
    }));
  };

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    name: string,
    index: number
  ) => {
    setSelectValues((prev) => ({
      ...prev,
      [name]: prev[name].map((val, i) => (i === index ? e.target.value : val)),
    }));
  };

  const doneHandler = (itemName: string, index: number) => {
    setFilteredData((prevData) =>
      prevData.map((item) => {
        if (item.name === itemName) {
          const newSubItem: IContributeInputForm = {
            name: inputValues[itemName][index] || "",
            type: selectValues[itemName][index] || "text",
          };

          return {
            ...item,
            type: "array", // Change type to "array"
            subItem: item.subItem
              ? [...item.subItem, newSubItem]
              : [newSubItem],
          };
        }
        return item;
      })
    );

  };

  const addColumn = (itemName: string) => {
    setInputValues((prev) => ({
      ...prev,
      [itemName]: prev[itemName] ? [...prev[itemName], ""] : [""],
    }));
    setSelectValues((prev) => ({
      ...prev,
      [itemName]: prev[itemName] ? [...prev[itemName], "text"] : ["text"],
    }));
  };

  const removeColumn = (itemName: string, index: number) => {
    setFilteredData((prevData) =>
      prevData.map((item) => {
        if (item.name === itemName && item.subItem) {
          const updatedSubItems = item.subItem.filter((_, i) => i !== index);
          return {
            ...item,
            subItem: updatedSubItems,
          };
        }
        return item;
      })
    );
    setInputValues((prev) => ({
      ...prev,
      [itemName]: prev[itemName].filter((_, i) => i !== index),
    }));
    setSelectValues((prev) => ({
      ...prev,
      [itemName]: prev[itemName].filter((_, i) => i !== index),
    }));
  };

  return (
    <>
      {filteredData.map((item) => (
        <div key={item.name} >
          <h2>{item.name}</h2>
          {(inputValues[item.name] || [""]).map((inputValue, index) => (
            <div
              key={`${item.name}-${index}`}
              style={{ display: "flex", alignItems: "center" }}
            >
              <input
                type="text"
                placeholder="custom_name"
                value={inputValue}
                onChange={(e) => handleInputChange(e, item.name, index)}
              />
              <select
                value={selectValues[item.name]?.[index] || "text"}
                onChange={(e) => handleSelectChange(e, item.name, index)}
              >
                <option value="text">text</option>
                <option value="number">number</option>
              </select>
              <button
                type="button"
                onClick={() => doneHandler(item.name, index)}
              >
                Done
              </button>
              <button
                type="button"
                disabled={index === 0}
                onClick={() => removeColumn(item.name, index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={() => addColumn(item.name)}>
            Add Column
          </button>
        </div>
      ))}
      <hr />
      <hr />
      <TableForm data={data} onTableInputData={onTableInputData} />
      <hr />
      <hr />
      <TableForm data={filteredData} onTableInputData={onTableInputData} />
    </>
  );
};

export default TableCustomForm;
