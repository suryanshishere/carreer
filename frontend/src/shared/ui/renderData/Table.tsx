import React from "react";
import { startCase } from "lodash";
import "./Table.css";

interface TableProps {
  tableObject?: Record<string, any>;
  tableArray?: Array<Record<string, any>>;
}

const Table: React.FC<TableProps> = ({ tableObject, tableArray }) => {
  const renderTableObject = (obj: Record<string, any>) => {
    return (
      <table className="table">
        <tbody>
          {Object.entries(obj).map(([key, value]) => (
            <tr key={key}>
              <td className="table-key">{startCase(key)}</td>
              <td className="table-value">
                {Array.isArray(value) ? (
                  value.map((item, index) => (
                    <div key={`item-${index}`}>
                      {typeof item === "object" && item !== null ? (
                        <Table tableObject={item} />
                      ) : (
                        item.toString()
                      )}
                    </div>
                  ))
                ) : typeof value === "object" && value !== null ? (
                  <Table tableObject={value} />
                ) : (
                  value.toString()
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderTableArray = (arr: Array<Record<string, any>>) => {
    if (arr.length === 0) return null;
    const headers = Object.keys(arr[0]);

    return (
      <table className="table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={`header-${header}`} className="table-header">
                {startCase(header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {arr.map((item, index) => (
            <tr key={`row-${index}`}>
              {headers.map((header) => (
                <td key={`cell-${index}-${header}`} className="table-value">
                  {Array.isArray(item[header]) ? (
                    item[header].map((subItem: any, subIndex: number) => (
                      <div key={`subItem-${subIndex}`}>
                        {typeof subItem === "object" && subItem !== null ? (
                          <Table tableObject={subItem} />
                        ) : (
                          subItem.toString()
                        )}
                      </div>
                    ))
                  ) : typeof item[header] === "object" &&
                    item[header] !== null ? (
                    <Table tableObject={item[header]} />
                  ) : (
                    item[header]?.toString() || ""
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      {tableObject && renderTableObject(tableObject)}
      {tableArray && renderTableArray(tableArray)}
    </div>
  );
};

export default Table;
