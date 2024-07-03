import {
  ObjectItem,
  RelatedDetailPage,
  TableItem,
} from "src/models/exam/DetailProps";

export function convertJson(data: any) {
  const result: RelatedDetailPage[] = [];

  const tables: { [key: string]: TableItem } = {};

  Object.entries(data).forEach(([key, value]) => {
    const parts = key.split("__");
    if (parts.length > 1) {
      const tableKey = parts[0];
      const columnOrRowKey = parts.slice(1).join("__");

      if (!tables[tableKey]) {
        tables[tableKey] = { row: [] };
      }

      const existingRowIndex = tables[tableKey].row.findIndex(
        (row) => (row as ObjectItem).key === columnOrRowKey
      );

      if (existingRowIndex !== -1) {
        const existingRow = tables[tableKey].row[
          existingRowIndex
        ] as ObjectItem;
        existingRow.value.push(value as string);
      } else {
        tables[tableKey].row.push({
          key: columnOrRowKey,
          value: [value as string],
        });
      }
    } else {
      result.push({
        key,
        value: [value as string],
      });
    }
  });

  Object.entries(tables).forEach(([key, table]) => {
    result.push({
      key,
      value: [{ table }],
    });
  });

  return result;
}
