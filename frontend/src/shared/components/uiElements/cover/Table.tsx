import React from "react";
import { Link } from "react-router-dom";
import { TableItem } from "src/models/exam/DetailProps";
import { formatWord } from "src/helpers/FormatWord";
import "./Table.css";
import { ValueHandler } from "../../utils/Helper";

interface TableProps {
  tableData: TableItem;
}

const Table: React.FC<TableProps> = ({ tableData }) => {
  console.log(tableData);
  return (
    <>
      {tableData && tableData.row && (
        <>
          {!tableData.column && (
            <table>
              <tbody className="flex flex-col gap-1">
                {tableData.row.map((rowItem, idx) => (
                  <tr className="table_tr" key={idx}>
                    {Array.isArray(rowItem) ? (
                      rowItem.map((cell, cellIdx) => (
                        <td className="table_td" key={cellIdx}>
                          {cell}
                        </td>
                      ))
                    ) : (
                      <>
                        {rowItem.key && (
                          <td
                            className=" min-w-fit self-center"
                            style={{ fontSize: "var(--font-size)" }}
                          >
                            <b>{formatWord(rowItem.key)}:</b>
                          </td>
                        )}
                        <td className="table_td">
                          <ValueHandler objectItem={rowItem}/>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tableData.column && (
            <table className="table_card flex flex-col gap-1">
              <thead className="normal_table_card">
                <tr className="table_tr">
                  {tableData.column?.map((col, colIdx) => (
                    <th
                      key={colIdx}
                      className="flex justify-center items-center"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="normal_table_card flex flex-col gap-1">
                {tableData.row.map((rowItem, rowIdx) => (
                  <tr className="table_tr" key={rowIdx}>
                    {Array.isArray(rowItem) &&
                      rowItem.map((cell, cellIdx) => (
                        <td className="table_td" key={cellIdx}>
                          {cell}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </>
  );
};

export default Table;
